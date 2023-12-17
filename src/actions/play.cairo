// Dojo imports

use dojo::world::IWorldDispatcher;

// System trait

#[starknet::interface]
trait IPlay<TContractState> {
    fn create(self: @TContractState, world: IWorldDispatcher, name: felt252,);
    fn seek(self: @TContractState, world: IWorldDispatcher,);
    fn roll(self: @TContractState, world: IWorldDispatcher, orders: u8,);
}

// System implementation

#[starknet::contract]
mod play {
    // Starknet imports

    use starknet::ContractAddress;
    use starknet::{get_tx_info, get_caller_address};

    // Dojo imports

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    // Models imports

    use slayer::models::slayer::{Slayer, SlayerTrait};
    use slayer::models::duel::{Duel, DuelTrait};

    // Internal imports

    use slayer::store::{Store, StoreTrait};

    // Local imports

    use super::IPlay;

    // Errors

    mod errors {
        const CREATE_SLAYER_ALREADY_EXISTS: felt252 = 'Create: Slayer already exists';
        const SEEK_SLAYER_NOT_FOUND: felt252 = 'Seek: Slayer not found';
        const SEEK_SLAYER_ALREADY_IN_DUEL: felt252 = 'Seek: Slayer already in duel';
        const PLAY_SLAYER_NOT_FOUND: felt252 = 'Play: Slayer not found';
        const PLAY_SLAYER_NOT_IN_DUEL: felt252 = 'Play: Slayer not in duel';
    }

    #[storage]
    struct Storage {}

    #[external(v0)]
    impl Play of IPlay<ContractState> {
        fn create(self: @ContractState, world: IWorldDispatcher, name: felt252) {
            // [Setup] Datastore
            let mut store: Store = StoreTrait::new(world);

            // [Check] Slayer not already exists
            let caller: felt252 = get_caller_address().into();
            let slayer: Slayer = store.slayer(caller);
            assert(slayer.name.is_zero(), errors::CREATE_SLAYER_ALREADY_EXISTS);

            // [Effect] Create slayer
            let slayer: Slayer = SlayerTrait::new(caller, name);
            store.set_slayer(slayer);
        }

        fn seek(self: @ContractState, world: IWorldDispatcher,) {
            // [Setup] Datastore
            let mut store: Store = StoreTrait::new(world);

            // [Check] Slayer exists
            let caller: felt252 = get_caller_address().into();
            let mut slayer: Slayer = store.slayer(caller);
            assert(slayer.name.is_non_zero(), errors::SEEK_SLAYER_NOT_FOUND);

            // [Check] Slayer not already in duel
            let duel: Duel = store.current_duel(slayer);
            assert(duel.seed.is_zero() || duel.over, errors::SEEK_SLAYER_ALREADY_IN_DUEL);

            // [Effect] Create duel
            let seed: felt252 = get_tx_info().unbox().transaction_hash;
            let mut duel: Duel = DuelTrait::new(slayer.duel_id, slayer.id, seed);
            duel.start();
            store.set_duel(duel);
        }

        fn roll(self: @ContractState, world: IWorldDispatcher, orders: u8,) {
            // [Setup] Datastore
            let mut store: Store = StoreTrait::new(world);

            // [Check] Slayer exists
            let caller: felt252 = get_caller_address().into();
            let mut slayer: Slayer = store.slayer(caller);
            assert(slayer.name.is_non_zero(), errors::PLAY_SLAYER_NOT_FOUND);

            // [Check] Slayer in duel
            let mut duel: Duel = store.current_duel(slayer);
            assert(duel.seed.is_non_zero() && !duel.over, errors::PLAY_SLAYER_NOT_IN_DUEL);

            // [Effect] Play duel
            duel.play(orders);

            // [Effect] Update duel
            store.set_duel(duel);

            // [Effect] Update slayer if duel is over
            if duel.over {
                slayer.duel_id += 1;

                // [Effect] Update gold and xp if slayer won
                // Draw is not considered as a win 
                if duel.slayer_score > duel.goblin_score {
                    slayer.gold += 1;
                    slayer.xp += 1;
                }

                store.set_slayer(slayer);
            }
        }
    }
}
