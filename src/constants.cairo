// Util constants

#[inline(always)]
fn ZERO() -> starknet::ContractAddress {
    starknet::contract_address_const::<0>()
}

// Game constants

const DEFAULT_DICE_COUNT: u8 = 5;
const DEFAULT_ROUND_COUNT: u8 = 3;

// Dice constants

const DICE_FACES_NUMBER: u8 = 6;

// Random constants

const SEED: felt252 = 'SEED';
