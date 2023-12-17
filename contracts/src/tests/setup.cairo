mod setup {
    // Starknet imports

    use starknet::ContractAddress;
    use starknet::testing::{set_contract_address, set_transaction_hash};

    // Dojo imports

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use dojo::test_utils::{spawn_test_world, deploy_contract};

    // Internal imports

    use slayer::models::slayer::Slayer;
    use slayer::models::duel::Duel;
    use slayer::actions::play::{play, IPlayDispatcher};
    use slayer::tests::mocks::vrf::{IVRFDispatcher, IVRFDispatcherTrait, vrf};

    // Constants

    fn SLAYER() -> ContractAddress {
        starknet::contract_address_const::<'SLAYER'>()
    }

    fn ANYONE() -> ContractAddress {
        starknet::contract_address_const::<'ANYONE'>()
    }

    const TX_HASH: felt252 = 'TX_HASH';

    #[derive(Drop)]
    struct Actions {
        play: IPlayDispatcher,
    }

    fn deploy_vrf() -> IVRFDispatcher {
        let (address, _) = starknet::deploy_syscall(
            vrf::TEST_CLASS_HASH.try_into().expect('Class hash conversion failed'),
            0,
            array![].span(),
            false
        )
            .expect('VRF deploy failed');
        IVRFDispatcher { contract_address: address }
    }

    fn spawn_game() -> (IWorldDispatcher, IVRFDispatcher, Actions) {
        // [Setup] World
        let mut models = array::ArrayTrait::new();
        models.append(slayer::models::slayer::slayer::TEST_CLASS_HASH);
        models.append(slayer::models::duel::duel::TEST_CLASS_HASH);
        let world = spawn_test_world(models);
        let vrf = deploy_vrf();

        // [Setup] Systems
        let play_address = deploy_contract(play::TEST_CLASS_HASH, array![].span());
        let actions = Actions { play: IPlayDispatcher { contract_address: play_address }, };

        // [Return]
        set_transaction_hash(TX_HASH);
        set_contract_address(SLAYER());
        (world, vrf, actions)
    }
}
