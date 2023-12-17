// Starknet imports

use starknet::ContractAddress;

// Errors

mod errors {
    const SLAYER_NAME_MUST_BE_NON_ZERO: felt252 = 'Slayer: name must be non zero';
}

#[derive(Model, Copy, Drop, Serde)]
struct Slayer {
    #[key]
    id: felt252,
    name: felt252,
    xp: u128,
    gold: u128,
    duel_id: u32,
}

trait SlayerTrait {
    fn new(id: felt252, name: felt252) -> Slayer;
}

impl SlayerImpl of SlayerTrait {
    #[inline(always)]
    fn new(id: felt252, name: felt252) -> Slayer {
        // [Check] Name must be non zero
        assert(name != '', errors::SLAYER_NAME_MUST_BE_NON_ZERO);
        Slayer { id: id, name: name, xp: 0, gold: 0, duel_id: 0 }
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use debug::PrintTrait;

    // Local imports

    use super::{Slayer, SlayerTrait};

    // Constants

    const ID: felt252 = 'ID';
    const NAME: felt252 = 'NAME';

    #[test]
    fn test_slayer_new() {
        let slayer = SlayerTrait::new(ID, NAME);
        assert_eq!(slayer.id, ID);
        assert_eq!(slayer.name, NAME);
        assert_eq!(slayer.xp, 0);
        assert_eq!(slayer.gold, 0);
    }
}
