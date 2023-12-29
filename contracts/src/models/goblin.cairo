// External imports

use origami::random::dice::{Dice, DiceTrait};

// Internal imports

use slayer::constants::DEFAULT_DICE_COUNT;

// Constants

const MULTIPLIER: u256 = 100;

#[derive(Drop, Copy)]
enum Rank {
    Goblin, // Rate: 37% with nothing predefined
    Rider, // Rate: 32% with a pair
    Hobgoblin, // Rate: 16% with a 3 of a kind
    Shaman, // Rate: 8% with a double pair
    Champion, // Rate: 4% with a fullhouse
    Lord, // Rate: 2% with a large straight
    Paladin, // Rate: 1% with a yahtzee
}

impl RankIntoU8 of Into<Rank, u8> {
    #[inline(always)]
    fn into(self: Rank) -> u8 {
        match self {
            Rank::Goblin => 0,
            Rank::Rider => 1,
            Rank::Hobgoblin => 2,
            Rank::Shaman => 3,
            Rank::Champion => 4,
            Rank::Lord => 5,
            Rank::Paladin => 6,
        }
    }
}

impl U8IntoRank of Into<u8, Rank> {
    #[inline(always)]
    fn into(self: u8) -> Rank {
        if self == 1 {
            return Rank::Rider;
        } else if self == 2 {
            return Rank::Hobgoblin;
        } else if self == 3 {
            return Rank::Shaman;
        } else if self == 4 {
            return Rank::Champion;
        } else if self == 5 {
            return Rank::Lord;
        } else if self == 6 {
            return Rank::Paladin;
        } else {
            return Rank::Goblin;
        }
    }
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
        } else if number < 3 {
            return Rank::Lord;
        } else if number < 7 {
            return Rank::Champion;
        } else if number < 15 {
            return Rank::Shaman;
        } else if number < 31 {
            return Rank::Hobgoblin;
        } else if number < 63 {
            return Rank::Rider;
        } else {
            return Rank::Goblin;
        }
    }

    fn setup(self: Goblin, ref dice: Dice, count: u8) -> Array<u8> {
        let mut dices: Array<u8> = array![];
        match self.rank {
            Rank::Goblin => {
                dices.append(1);
                dices.append(2);
                loop {
                    if dices.len() + 2 >= count.into() {
                        break;
                    }
                    dices.append(dice.roll());
                };
                dices.append(dice.face_count);
                dices.append(dice.face_count - 1);
                dices
            },
            Rank::Rider => {
                let value = dice.roll();
                dices.append(value);
                dices.append(value);
                loop {
                    if dices.len() + 1 >= count.into() {
                        break;
                    }
                    let new = dice.roll();
                    if new != value {
                        dices.append(new);
                    };
                };
                // Add the last dice without checking for randomness
                dices.append(dice.roll());
                dices
            },
            Rank::Hobgoblin => {
                let value = dice.roll();
                dices.append(value);
                dices.append(value);
                dices.append(value);
                loop {
                    if dices.len() + 1 >= count.into() {
                        break;
                    }
                    let new = dice.roll();
                    if new != value {
                        dices.append(new);
                    };
                };
                // Add the last dice without checking for randomness
                dices.append(dice.roll());
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
                    if dices.len() + 1 >= count.into() {
                        break;
                    }
                    let new = dice.roll();
                    if new != value {
                        dices.append(new);
                    };
                };
                // Add the last dice without checking for randomness
                dices.append(dice.roll());
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
                if value == dice.face_count {
                    value -= 1;
                };
                dices.append(value);
                loop {
                    if dices.len() >= count.into() {
                        break;
                    }
                    if value == 1 {
                        value = dice.face_count - 1;
                    } else {
                        value -= 1;
                    };
                    dices.append(value);
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
