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
use slayer::tests::mocks::vrf::{IVRFDispatcher, IVRFDispatcherTrait};

// Constants

const SLAYER_NAME: felt252 = 'SLAYER';

#[test]
#[should_panic(expected: ('Slayer: not enough item', 'ENTRYPOINT_FAILED',))]
fn test_play_consume() {
    // [Setup]
    let (world, vrf, actions) = setup::spawn_game();
    let mut store = StoreTrait::new(world);

    // [Create]
    actions.play.create(world, SLAYER_NAME);

    // [Seek]
    actions.play.seek(world);
    vrf.submit_random();

    // [Buy]
    actions.play.consume(world, Item::ExtraRound);
}
