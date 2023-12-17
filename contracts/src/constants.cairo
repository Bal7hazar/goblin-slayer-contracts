// Game constants

const DEFAULT_DICE_COUNT: u8 = 5;
const DEFAULT_ROUND_COUNT: u8 = 3;

// Dice constants

const DICE_FACES_NUMBER: u8 = 6;

// Random constants

const SEED: felt252 = 'SEED';

// Shop constants

const EXTRA_ROUND_PRICE: u8 = 10;
const EXTRA_DICE_PRICE: u8 = 50;

// VRF constants

const CALLBACK_FEE_LIMIT: u128 = 1000000000000000; // 0.001 ETH
const PUBLISH_DELAY: u64 = 0; // 0 block

// Addresses

fn ETH_ADDRESS() -> starknet::ContractAddress {
    starknet::contract_address_const::<
        0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
    >()
}

// fn VRF_ADDRESS() -> starknet::ContractAddress {
//     starknet::contract_address_const::<
//         0x693d551265f0be7ccb3c869c64b5920929caaf486497788d43cb37dd17d6be6
//     >()
// }

fn VRF_ADDRESS() -> starknet::ContractAddress {
    starknet::contract_address_const::<0x3>()
}
