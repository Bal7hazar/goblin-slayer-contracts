// Starknet imports

use starknet::ContractAddress;

#[starknet::interface]
trait IERC20<TContractState> {
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
}


#[starknet::contract]
mod eth {
    // Starknet imports

    use starknet::ContractAddress;

    // Local imports

    use super::IERC20;

    #[storage]
    struct Storage {}

    #[constructor]
    fn constructor(ref self: ContractState) {}


    #[external(v0)]
    impl ERC20Impl of IERC20<ContractState> {
        fn approve(ref self: ContractState, spender: ContractAddress, amount: u256) -> bool {
            true
        }
    }
}
