//! Store struct and component management methods.

// Straknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Models imports

use slayer::models::slayer::{Slayer, SlayerTrait};
use slayer::models::duel::{Duel, DuelTrait};

/// Store struct.
#[derive(Drop)]
struct Store {
    world: IWorldDispatcher
}

/// Trait to initialize, get and set models from the Store.
trait StoreTrait {
    fn new(world: IWorldDispatcher) -> Store;
    fn slayer(ref self: Store, id: felt252) -> Slayer;
    fn duel(ref self: Store, slayer: Slayer) -> Duel;
    fn set_slayer(ref self: Store, slayer: Slayer);
    fn set_duel(ref self: Store, duel: Duel);
}

/// Implementation of the `StoreTrait` trait for the `Store` struct.
impl StoreImpl of StoreTrait {
    fn new(world: IWorldDispatcher) -> Store {
        Store { world: world }
    }

    fn slayer(ref self: Store, id: felt252) -> Slayer {
        get!(self.world, id, (Slayer))
    }

    fn duel(ref self: Store, slayer: Slayer) -> Duel {
        get!(self.world, slayer.id, (Duel))
    }

    fn set_slayer(ref self: Store, slayer: Slayer) {
        set!(self.world, (slayer))
    }

    fn set_duel(ref self: Store, duel: Duel) {
        set!(self.world, (duel))
    }
}
