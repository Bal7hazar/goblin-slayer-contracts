// Core imports

use debug::PrintTrait;

// Starknet imports

use starknet::testing::set_contract_address;

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports

use slayer::store::{Store, StoreTrait};
use slayer::models::slayer::{Slayer, SlayerTrait, Item};
use slayer::models::duel::{Duel, DuelTrait};
use slayer::actions::play::IPlayDispatcherTrait;
use slayer::tests::setup::{setup, setup::{Actions, SLAYER, ANYONE}};

// Constants

const SLAYER_NAME: felt252 = 'SLAYER';

#[test]
#[should_panic(expected: ('Buy: not enough gold', 'ENTRYPOINT_FAILED',))]
fn test_play_buy() {
    // [Setup]
    let (world, eth, vrf, actions) = setup::spawn_game();
    let mut store = StoreTrait::new(world);

    // [Create]
    actions.play.create(world, SLAYER_NAME);

    // [Buy]
    actions.play.buy(world, Item::ExtraRound);
}
