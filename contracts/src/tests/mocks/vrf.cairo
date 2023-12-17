// Starknet imports

use starknet::ContractAddress;

#[starknet::interface]
trait IReceiver<TContractState> {
    fn receive_random_words(
        ref self: TContractState,
        requestor_address: ContractAddress,
        request_id: u64,
        random_words: Span<felt252>
    );
}

#[starknet::interface]
trait IVRF<TContractState> {
    fn request_random(
        ref self: TContractState,
        seed: u64,
        callback_address: ContractAddress,
        callback_fee_limit: u128,
        publish_delay: u64,
        num_words: u64
    ) -> u64;
    fn submit_random(ref self: TContractState);
}

#[starknet::contract]
mod vrf {
    // Starknet imports

    use starknet::ContractAddress;

    // Local imports

    use super::{IVRF, IReceiverDispatcher, IReceiverDispatcherTrait};

    #[storage]
    struct Storage {
        counter: u64,
        callback_address: ContractAddress
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}


    #[external(v0)]
    impl VRFImpl of IVRF<ContractState> {
        fn request_random(
            ref self: ContractState,
            seed: u64,
            callback_address: ContractAddress,
            callback_fee_limit: u128,
            publish_delay: u64,
            num_words: u64
        ) -> u64 {
            let counter = self.counter.read() + 1;
            self.counter.write(counter);
            self.callback_address.write(callback_address);
            counter
        }

        fn submit_random(ref self: ContractState) {
            let request_id = self.counter.read();
            let random_words = array![request_id.into(),];

            let callback_address = self.callback_address.read();
            let mut receiver = IReceiverDispatcher { contract_address: callback_address };
            receiver
                .receive_random_words(
                    requestor_address: callback_address,
                    request_id: request_id,
                    random_words: random_words.span(),
                );
        }
    }
}
