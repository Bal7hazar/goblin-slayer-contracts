// Starknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::IWorldDispatcher;

// Model imports

use slayer::models::slayer::Item;

// System trait

#[starknet::interface]
trait IPlay<TContractState> {
    fn create(self: @TContractState, world: IWorldDispatcher, name: felt252,);
    fn seek(ref self: TContractState, world: IWorldDispatcher,);
    fn roll(self: @TContractState, world: IWorldDispatcher, orders: u8,);
    fn buy(self: @TContractState, world: IWorldDispatcher, item: Item,);
    fn consume(self: @TContractState, world: IWorldDispatcher, item: Item,);
    fn receive_random_words(
        ref self: TContractState,
        requestor_address: ContractAddress,
        request_id: u64,
        random_words: Span<felt252>
    );
}

// System implementation

#[starknet::contract]
mod play {
    // Starknet imports

    use starknet::ContractAddress;
    use starknet::info::{
        get_block_timestamp, get_block_number, get_caller_address, get_contract_address
    };

    // Dojo imports

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    // External imports

    use pragma_lib::abi::{IRandomnessDispatcher, IRandomnessDispatcherTrait};

    // Models imports

    use slayer::models::slayer::{Slayer, SlayerTrait, Item};
    use slayer::models::duel::{Duel, DuelTrait};

    // Internal imports

    use slayer::store::{Store, StoreTrait};
    use slayer::constants::{
        EXTRA_DICE_PRICE, EXTRA_ROUND_PRICE, CALLBACK_FEE_LIMIT, PUBLISH_DELAY, VRF_ADDRESS
    };

    // Local imports

    use super::IPlay;

    // Errors

    mod errors {
        const CREATE_SLAYER_ALREADY_EXISTS: felt252 = 'Create: slayer already exists';
        const SEEK_SLAYER_NOT_FOUND: felt252 = 'Seek: slayer not found';
        const SEEK_SLAYER_ALREADY_IN_DUEL: felt252 = 'Seek: slayer already in duel';
        const SEEK_CALLER_IS_NOT_VRF: felt252 = 'Seek: caller is not VRF';
        const SEEK_REQUEST_NOT_FROUND: felt252 = 'Seek: request not found';
        const SEEK_PUBLISH_DELAY_PASSED: felt252 = 'Seek: publish delay passed';
        const SEEK_INVALID_REQUESTOR: felt252 = 'Seek: invalid requestor';
        const PLAY_SLAYER_NOT_FOUND: felt252 = 'Play: slayer not found';
        const PLAY_SLAYER_NOT_IN_DUEL: felt252 = 'Play: slayer not in duel';
        const BUY_SLAYER_NOT_FOUND: felt252 = 'Buy: slayer not found';
        const BUY_SLAYER_ALREADY_IN_DUEL: felt252 = 'Buy: slayer already in duel';
        const BUY_NOT_ENOUGH_GOLD: felt252 = 'Buy: not enough gold';
        const CONSUME_SLAYER_NOT_FOUND: felt252 = 'Consume: slayer not found';
        const CONSUME_SLAYER_NOT_IN_DUEL: felt252 = 'Consume: slayer not in duel';
    }

    #[storage]
    struct Storage {
        requesters: LegacyMap<u64, felt252>,
        min_block_number: LegacyMap<u64, u64>,
        worlds: LegacyMap<u64, IWorldDispatcher>,
    }

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

        fn seek(ref self: ContractState, world: IWorldDispatcher,) {
            // [Setup] Datastore
            let mut store: Store = StoreTrait::new(world);

            // [Check] Slayer exists
            let caller: felt252 = get_caller_address().into();
            let mut slayer: Slayer = store.slayer(caller);
            assert(slayer.name.is_non_zero(), errors::SEEK_SLAYER_NOT_FOUND);

            // [Check] Slayer not already in duel
            let duel: Duel = store.current_duel(slayer);
            assert(duel.seed.is_zero() || duel.over, errors::SEEK_SLAYER_ALREADY_IN_DUEL);

            // [Interaction] Request randomness
            let vrf = IRandomnessDispatcher { contract_address: VRF_ADDRESS() };
            let seed: u64 = get_block_timestamp();
            let callback_address: ContractAddress = get_contract_address();
            let num_words = 1;
            let request_id = vrf
                .request_random(
                    seed, callback_address, CALLBACK_FEE_LIMIT, PUBLISH_DELAY, num_words
                );

            // [Effect] Store request data
            let min_block_number = get_block_number() + PUBLISH_DELAY;
            self.requesters.write(request_id, caller);
            self.min_block_number.write(request_id, min_block_number);
            self.worlds.write(request_id, world);
        }

        fn receive_random_words(
            ref self: ContractState,
            requestor_address: ContractAddress,
            request_id: u64,
            random_words: Span<felt252>
        ) {
            // [Check] Caller is VRF
            let caller = get_caller_address();
            assert(get_caller_address() == VRF_ADDRESS(), errors::SEEK_CALLER_IS_NOT_VRF);

            // [Check] Request exists
            let slayer_address = self.requesters.read(request_id);
            assert(slayer_address.is_non_zero(), errors::SEEK_REQUEST_NOT_FROUND);

            // [Check] Request is within publish_delay
            let current_block_number = get_block_number();
            let min_block_number = self.min_block_number.read(request_id);
            assert(min_block_number <= current_block_number, errors::SEEK_PUBLISH_DELAY_PASSED);

            // [Check] Requester is the contract
            let contract_address = get_contract_address();
            assert(requestor_address == contract_address, errors::SEEK_INVALID_REQUESTOR);

            // [Setup] Datastore
            let world = self.worlds.read(request_id);
            let mut store: Store = StoreTrait::new(world);

            // [Effect] Create duel
            let slayer = store.slayer(slayer_address);
            let seed = *random_words.at(0);
            let mut duel: Duel = DuelTrait::new(slayer.duel_id, slayer.id, seed);
            duel.start();
            store.set_duel(duel);

            // [Effect] Clear request
            self.requesters.write(request_id, 0);
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
            duel.roll(orders);

            // [Effect] Update duel
            store.set_duel(duel);

            // [Effect] Update slayer if duel is over
            if duel.over {
                slayer.duel_id += 1;

                // [Effect] Update gold and xp if slayer won
                // Draw is considered as a lose 
                if duel.slayer_score > duel.goblin_score {
                    slayer.gold += 1;
                    slayer.xp += 1;
                } else {
                    slayer.gold = 0;
                    slayer.xp = 0;
                }

                store.set_slayer(slayer);
            }
        }

        fn buy(self: @ContractState, world: IWorldDispatcher, item: Item) {
            // [Setup] Datastore
            let mut store: Store = StoreTrait::new(world);

            // [Check] Slayer exists
            let caller: felt252 = get_caller_address().into();
            let mut slayer: Slayer = store.slayer(caller);
            assert(slayer.name.is_non_zero(), errors::PLAY_SLAYER_NOT_FOUND);

            // [Check] Slayer not already in duel
            let duel: Duel = store.current_duel(slayer);
            assert(duel.seed.is_zero() || duel.over, errors::BUY_SLAYER_ALREADY_IN_DUEL);

            // [Check] Enough gold
            let cost = match item {
                Item::ExtraRound => {
                    assert(slayer.gold >= EXTRA_ROUND_PRICE.into(), errors::BUY_NOT_ENOUGH_GOLD);
                    EXTRA_ROUND_PRICE
                },
                Item::ExtraDice => {
                    assert(slayer.gold >= EXTRA_DICE_PRICE.into(), errors::BUY_NOT_ENOUGH_GOLD);
                    EXTRA_DICE_PRICE
                },
            };

            // [Effect] Spend gold, add item and update slayer
            slayer.gold -= cost.into();
            slayer.add(item);
            store.set_slayer(slayer);
        }

        fn consume(self: @ContractState, world: IWorldDispatcher, item: Item) {
            // [Setup] Datastore
            let mut store: Store = StoreTrait::new(world);

            // [Check] Slayer exists
            let caller: felt252 = get_caller_address().into();
            let mut slayer: Slayer = store.slayer(caller);
            assert(slayer.name.is_non_zero(), errors::CONSUME_SLAYER_NOT_FOUND);

            // [Check] Slayer in duel
            let duel: Duel = store.current_duel(slayer);
            assert(duel.seed.is_non_zero() && !duel.over, errors::CONSUME_SLAYER_NOT_IN_DUEL);

            // [Effect] Sub item and update slayer
            slayer.sub(item); // Throws if not enough item
            store.set_slayer(slayer);
        }
    }
}
