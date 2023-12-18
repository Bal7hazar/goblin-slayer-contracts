// External imports

use origami::random::dice::{Dice, DiceTrait};

// Internal imports

use slayer::constants::DEFAULT_DICE_COUNT;

// Constants

const MULTIPLIER: u256 = 100000;

#[derive(Drop, Copy)]
enum Rank {
    Goblin, // Rate: 68+% with nothing predefined
    Rider, // Rate: 20% with a pair
    Hobgoblin, // Rate: 10.0% with a 3 of a kind
    Shaman, // Rate: 1.0% with a double pair
    Champion, // Rate: 0.1% with a fullhouse
    Lord, // Rate: 0.01% with a large straight
    Paladin, // Rate: 0.001% with a yahtzee
}

#[derive(Drop, Copy)]
struct Goblin {
    rank: Rank,
}

trait GoblinTrait {
    fn new(seed: felt252) -> Goblin;
    fn rank(seed: felt252) -> Rank;
    fn setup(self: Goblin, ref dice: Dice, count: u8) -> Array<u8>;
    fn xp(self: Goblin) -> u128;
    fn gold(self: Goblin) -> u128;
}

impl GoblinImpl of GoblinTrait {
    #[inline(always)]
    fn new(seed: felt252) -> Goblin {
        Goblin { rank: GoblinTrait::rank(seed) }
    }

    #[inline(always)]
    fn rank(seed: felt252) -> Rank {
        let number = seed.into() % MULTIPLIER;
        if number < 1 {
            return Rank::Paladin;
        } else if number < 10 {
            return Rank::Lord;
        } else if number < 100 {
            return Rank::Champion;
        } else if number < 1000 {
            return Rank::Shaman;
        } else if number < 10000 {
            return Rank::Hobgoblin;
        } else if number < 20000 {
            return Rank::Rider;
        } else {
            return Rank::Goblin;
        }
    }

    fn setup(self: Goblin, ref dice: Dice, count: u8) -> Array<u8> {
        let mut dices: Array<u8> = array![];
        match self.rank {
            Rank::Goblin => {
                loop {
                    if dices.len() >= count.into() {
                        break;
                    }
                    dices.append(dice.roll());
                };
                dices
            },
            Rank::Rider => {
                let value = dice.roll();
                dices.append(value);
                dices.append(value);
                loop {
                    if dices.len() >= count.into() {
                        break;
                    }
                    dices.append(dice.roll());
                };
                dices
            },
            Rank::Hobgoblin => {
                let value = dice.roll();
                dices.append(value);
                dices.append(value);
                dices.append(value);
                loop {
                    if dices.len() >= count.into() {
                        break;
                    }
                    dices.append(dice.roll());
                };
                dices
            },
            Rank::Shaman => {
                let value = dice.roll();
                dices.append(value);
                dices.append(value);
                let value = dice.roll();
                dices.append(value);
                dices.append(value);
                loop {
                    if dices.len() >= count.into() {
                        break;
                    }
                    dices.append(dice.roll());
                };
                dices
            },
            Rank::Champion => {
                let value = dice.roll();
                dices.append(value);
                dices.append(value);
                let value = dice.roll();
                dices.append(value);
                dices.append(value);
                dices.append(value);
                loop {
                    if dices.len() >= count.into() {
                        break;
                    }
                    dices.append(dice.roll());
                };
                dices
            },
            Rank::Lord => {
                let mut value = dice.roll();
                dices.append(value);
                loop {
                    if dices.len() >= count.into() {
                        break;
                    }
                    dices.append(value);
                    if value == 1 {
                        value = dice.face_count;
                    } else {
                        value -= 1;
                    };
                };
                dices
            },
            Rank::Paladin => {
                let value = dice.roll();
                dices.append(value);
                dices.append(value);
                dices.append(value);
                dices.append(value);
                dices.append(value);
                loop {
                    if dices.len() >= count.into() {
                        break;
                    }
                    dices.append(dice.roll());
                };
                dices
            },
        }
    }

    #[inline(always)]
    fn xp(self: Goblin) -> u128 {
        match self.rank {
            Rank::Goblin => 1,
            Rank::Rider => 2,
            Rank::Hobgoblin => 4,
            Rank::Shaman => 8,
            Rank::Champion => 16,
            Rank::Lord => 32,
            Rank::Paladin => 64,
        }
    }

    #[inline(always)]
    fn gold(self: Goblin) -> u128 {
        match self.rank {
            Rank::Goblin => 1,
            Rank::Rider => 2,
            Rank::Hobgoblin => 4,
            Rank::Shaman => 8,
            Rank::Champion => 16,
            Rank::Lord => 32,
            Rank::Paladin => 64,
        }
    }
}
