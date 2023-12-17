// Core imports

use dict::{Felt252Dict, Felt252DictTrait};

// Internal imports

use slayer::constants::DICE_FACES_NUMBER;

// Constants

const FULL_HOUSE: u32 = 25;
const SMALL_STRAIGHT: u32 = 30;
const LARGE_STRAIGHT: u32 = 40;
const YAHTZEE: u32 = 50;

// Errors

mod errors {
    const UNEXPECTED_DICES_COUNT: felt252 = 'Score: unexpected dice count';
}

#[derive(Serde, Copy, Drop, Introspect)]
enum Category {
    None,
    Ones,
    Twos,
    Threes,
    Fours,
    Fives,
    Sixes,
    Pair,
    TwoPairs,
    ThreeOfAKind,
    FourOfAKind,
    SmallStraight,
    LargeStraight,
    FullHouse,
    Yahtzee,
    Chance,
}

#[derive(Serde, Copy, Drop, Introspect)]
struct Score {
    value: u32,
    category: Category,
}

trait ScoreTrait {
    fn best(dices: Span<u8>) -> Score;
    fn ones(dices: Span<u8>) -> u32;
    fn twos(dices: Span<u8>) -> u32;
    fn threes(dices: Span<u8>) -> u32;
    fn fours(dices: Span<u8>) -> u32;
    fn fives(dices: Span<u8>) -> u32;
    fn sixes(dices: Span<u8>) -> u32;
    fn pair(dices: Span<u8>) -> u32;
    fn two_pairs(dices: Span<u8>) -> u32;
    fn three_of_a_kind(dices: Span<u8>) -> u32;
    fn four_of_a_kind(dices: Span<u8>) -> u32;
    fn small_straight(dices: Span<u8>) -> u32;
    fn large_straight(dices: Span<u8>) -> u32;
    fn full_house(dices: Span<u8>) -> u32;
    fn yahtzee(dices: Span<u8>) -> u32;
    fn chance(dices: Span<u8>) -> u32;
}

impl ScoreImpl of ScoreTrait {
    fn best(dices: Span<u8>) -> Score {
        let chance = ScoreTrait::chance(dices);
        let yahtzee = ScoreTrait::yahtzee(dices);
        if yahtzee >= chance {
            return Score { value: yahtzee, category: Category::Yahtzee };
        }
        let large_straight = ScoreTrait::large_straight(dices);
        if large_straight >= chance {
            return Score { value: large_straight, category: Category::LargeStraight };
        }
        let small_straight = ScoreTrait::small_straight(dices);
        if small_straight >= chance {
            return Score { value: small_straight, category: Category::SmallStraight };
        }
        let four_of_a_kind = ScoreTrait::four_of_a_kind(dices);
        if four_of_a_kind >= chance {
            return Score { value: four_of_a_kind, category: Category::FourOfAKind };
        }
        let three_of_a_kind = ScoreTrait::three_of_a_kind(dices);
        if three_of_a_kind >= chance {
            return Score { value: three_of_a_kind, category: Category::ThreeOfAKind };
        }
        let two_pairs = ScoreTrait::two_pairs(dices);
        if two_pairs >= chance {
            return Score { value: two_pairs, category: Category::TwoPairs };
        }
        let pair = ScoreTrait::pair(dices);
        if pair >= chance {
            return Score { value: pair, category: Category::Pair };
        }
        Score { value: chance, category: Category::Chance }
    // FIXME: Following are only relevant in case of full yahtzee game
    // let sixes = ScoreTrait::sixes(dices);
    // if sixes >= chance {
    //     return Score { value: sixes, category: Category::Sixes };
    // }
    // let fives = ScoreTrait::fives(dices);
    // if fives >= chance {
    //     return Score { value: fives, category: Category::Fives };
    // }
    // let fours = ScoreTrait::fours(dices);
    // if fours >= chance {
    //     return Score { value: fours, category: Category::Fours };
    // }
    // let threes = ScoreTrait::threes(dices);
    // if threes >= chance {
    //     return Score { value: threes, category: Category::Threes };
    // }
    // let twos = ScoreTrait::twos(dices);
    // if twos >= chance {
    //     return Score { value: twos, category: Category::Twos };
    // }
    // let ones = ScoreTrait::ones(dices);
    // if ones >= chance {
    //     return Score { value: ones, category: Category::Ones };
    // }
    }

    fn ones(dices: Span<u8>) -> u32 {
        PrivateTrait::singles(dices, 1)
    }

    fn twos(dices: Span<u8>) -> u32 {
        PrivateTrait::singles(dices, 2)
    }

    fn threes(dices: Span<u8>) -> u32 {
        PrivateTrait::singles(dices, 3)
    }

    fn fours(dices: Span<u8>) -> u32 {
        PrivateTrait::singles(dices, 4)
    }

    fn fives(dices: Span<u8>) -> u32 {
        PrivateTrait::singles(dices, 5)
    }

    fn sixes(dices: Span<u8>) -> u32 {
        PrivateTrait::singles(dices, 6)
    }

    fn pair(dices: Span<u8>) -> u32 {
        PrivateTrait::some_of_a_kind(dices, 2, 1)
    }

    fn two_pairs(mut dices: Span<u8>) -> u32 {
        PrivateTrait::some_of_a_kind(dices, 2, 2)
    }

    fn three_of_a_kind(mut dices: Span<u8>) -> u32 {
        PrivateTrait::some_of_a_kind(dices, 3, 1)
    }

    fn four_of_a_kind(mut dices: Span<u8>) -> u32 {
        PrivateTrait::some_of_a_kind(dices, 4, 1)
    }

    fn small_straight(mut dices: Span<u8>) -> u32 {
        if PrivateTrait::straight(dices, 4) {
            SMALL_STRAIGHT
        } else {
            0
        }
    }

    fn large_straight(mut dices: Span<u8>) -> u32 {
        if PrivateTrait::straight(dices, 5) {
            LARGE_STRAIGHT
        } else {
            0
        }
    }

    fn full_house(mut dices: Span<u8>) -> u32 {
        // Fill hashmap and read from topest values to lowest
        let mut values: Felt252Dict<u8> = PrivateTrait::hashmap(dices);
        let mut index = DICE_FACES_NUMBER;
        let mut two_of_a_kind: bool = false;
        let mut three_of_a_kind: bool = false;
        loop {
            if index == 0 {
                break;
            }
            let value = values.get(index.into());
            if !three_of_a_kind && value >= 3 {
                three_of_a_kind = true;
            } else if !two_of_a_kind && value >= 2 {
                two_of_a_kind = true;
            }
            index -= 1;
        };
        if two_of_a_kind && three_of_a_kind {
            return FULL_HOUSE;
        }
        0
    }

    fn yahtzee(mut dices: Span<u8>) -> u32 {
        let number = dices.len().try_into().expect(errors::UNEXPECTED_DICES_COUNT);
        let score = PrivateTrait::some_of_a_kind(dices, number, 1);
        if score > 0 {
            return YAHTZEE;
        }
        0
    }

    fn chance(mut dices: Span<u8>) -> u32 {
        let mut score = 0;
        loop {
            match dices.pop_front() {
                Option::Some(dice) => {
                    let value = *dice;
                    score += value.into();
                },
                Option::None => { break; },
            }
        };
        score
    }
}

#[generate_trait]
impl PrivateImpl of PrivateTrait {
    fn singles(mut dices: Span<u8>, number: u8) -> u32 {
        let mut score = 0;
        loop {
            match dices.pop_front() {
                Option::Some(dice) => {
                    let value = *dice;
                    if value == number {
                        score += value.into();
                    };
                },
                Option::None => { break; },
            }
        };
        score
    }

    fn some_of_a_kind(mut dices: Span<u8>, number: u8, count: u8) -> u32 {
        // Fill hashmap and read from topest values to lowest
        let mut values: Felt252Dict<u8> = PrivateTrait::hashmap(dices);
        let mut score: u32 = 0;
        let mut counter: u8 = 0;
        let mut index = DICE_FACES_NUMBER;
        loop {
            if index == 0 {
                break;
            }
            let value = values.get(index.into());
            if value >= number {
                score += (index * number).into();
                counter += 1;
            }
            index -= 1;
        };
        if counter >= count {
            return score;
        }
        0
    }

    fn straight(mut dices: Span<u8>, number: u8) -> bool {
        // Fill hashmap and read from topest values to lowest
        let mut values: Felt252Dict<u8> = PrivateTrait::hashmap(dices);
        let mut straight: u8 = 0;
        let mut index = DICE_FACES_NUMBER;
        loop {
            // If we reach the end, we don't have a straight
            if index == 0 {
                break false;
            }
            let value = values.get(index.into());
            if value >= 1 {
                straight += 1;
            } else {
                straight = 0;
            }
            // If we reach the number, we have a straight
            if straight == number {
                break true;
            }
            index -= 1;
        }
    }

    fn hashmap(mut dices: Span<u8>) -> Felt252Dict<u8> {
        let mut values: Felt252Dict<u8> = Default::default();
        loop {
            match dices.pop_front() {
                Option::Some(dice) => {
                    let value = *dice;
                    let stored_value = values.get(value.into());
                    values.insert(value.into(), stored_value + 1);
                },
                Option::None => { break; },
            }
        };
        values
    }
}

impl ScoreZeroable of Zeroable<Score> {
    #[inline(always)]
    fn zero() -> Score {
        Score { value: 0, category: Category::None }
    }

    #[inline(always)]
    fn is_zero(self: Score) -> bool {
        self.value == 0
    }

    #[inline(always)]
    fn is_non_zero(self: Score) -> bool {
        self.value != 0
    }
}

impl ScorePartialEq of PartialEq<Score> {
    #[inline(always)]
    fn eq(lhs: @Score, rhs: @Score) -> bool {
        return lhs.value == rhs.value;
    }

    #[inline(always)]
    fn ne(lhs: @Score, rhs: @Score) -> bool {
        return lhs.value != rhs.value;
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use debug::PrintTrait;

    // Local imports

    use super::{ScoreTrait, DICE_FACES_NUMBER, FULL_HOUSE, SMALL_STRAIGHT, LARGE_STRAIGHT, YAHTZEE};

    #[test]
    fn test_ones() {
        let dices = array![1, 1, 1, 1, 1];
        let score = ScoreTrait::ones(dices.span());
        assert_eq!(score, 5);
    }

    #[test]
    fn test_ones_with_no_ones() {
        let dices = array![6, 2, 3, 4, 5];
        let score = ScoreTrait::ones(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_twos() {
        let dices = array![2, 2, 2, 2, 2];
        let score = ScoreTrait::twos(dices.span());
        assert_eq!(score, 10);
    }

    #[test]
    fn test_twos_with_no_twos() {
        let dices = array![1, 6, 3, 4, 5];
        let score = ScoreTrait::twos(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_threes() {
        let dices = array![3, 3, 3, 3, 3];
        let score = ScoreTrait::threes(dices.span());
        assert_eq!(score, 15);
    }

    #[test]
    fn test_threes_with_no_threes() {
        let dices = array![1, 2, 6, 4, 5];
        let score = ScoreTrait::threes(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_fours() {
        let dices = array![4, 4, 4, 4, 4];
        let score = ScoreTrait::fours(dices.span());
        assert_eq!(score, 20);
    }

    #[test]
    fn test_fours_with_no_fours() {
        let dices = array![1, 2, 3, 6, 5];
        let score = ScoreTrait::fours(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_fives() {
        let dices = array![5, 5, 5, 5, 5];
        let score = ScoreTrait::fives(dices.span());
        assert_eq!(score, 25);
    }

    #[test]
    fn test_fives_with_no_fives() {
        let dices = array![1, 2, 3, 4, 6];
        let score = ScoreTrait::fives(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_sixes() {
        let dices = array![6, 6, 6, 6, 6];
        let score = ScoreTrait::sixes(dices.span());
        assert_eq!(score, 30);
    }

    #[test]
    fn test_sixes_with_no_sixes() {
        let dices = array![1, 2, 3, 4, 5];
        let score = ScoreTrait::sixes(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_pair() {
        let dices = array![1, 1, 1, 1, 1];
        let score = ScoreTrait::pair(dices.span());
        assert_eq!(score, 2);
    }

    #[test]
    fn test_pair_with_no_pair() {
        let dices = array![1, 2, 3, 4, 5];
        let score = ScoreTrait::pair(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_two_pairs() {
        let dices = array![1, 2, 1, 3, 2];
        let score = ScoreTrait::two_pairs(dices.span());
        assert_eq!(score, 6);
    }

    #[test]
    fn test_two_pairs_with_no_two_pairs() {
        let dices = array![1, 2, 3, 4, 5];
        let score = ScoreTrait::two_pairs(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_three_of_a_kind() {
        let dices = array![1, 1, 1, 1, 1];
        let score = ScoreTrait::three_of_a_kind(dices.span());
        assert_eq!(score, 3);
    }

    #[test]
    fn test_three_of_a_kind_with_no_three_of_a_kind() {
        let dices = array![1, 2, 3, 4, 5];
        let score = ScoreTrait::three_of_a_kind(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_four_of_a_kind() {
        let dices = array![1, 1, 1, 1, 1];
        let score = ScoreTrait::four_of_a_kind(dices.span());
        assert_eq!(score, 4);
    }

    #[test]
    fn test_four_of_a_kind_with_no_four_of_a_kind() {
        let dices = array![1, 2, 3, 4, 5];
        let score = ScoreTrait::four_of_a_kind(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_small_straight() {
        let dices = array![1, 2, 6, 4, 3];
        let score = ScoreTrait::small_straight(dices.span());
        assert_eq!(score, SMALL_STRAIGHT);
    }

    #[test]
    fn test_small_straight_with_no_straight() {
        let dices = array![1, 1, 3, 4, 6];
        let score = ScoreTrait::small_straight(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_large_straight() {
        let dices = array![1, 2, 3, 4, 5];
        let score = ScoreTrait::large_straight(dices.span());
        assert_eq!(score, LARGE_STRAIGHT);
    }

    #[test]
    fn test_large_straight_with_no_straight() {
        let dices = array![1, 2, 3, 4, 6];
        let score = ScoreTrait::large_straight(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_full_house() {
        let dices = array![2, 1, 1, 1, 2];
        let score = ScoreTrait::full_house(dices.span());
        assert_eq!(score, FULL_HOUSE);
    }

    #[test]
    fn test_full_house_with_no_full_house() {
        let dices = array![1, 2, 3, 4, 5];
        let score = ScoreTrait::full_house(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_yahtzee() {
        let dices = array![1, 1, 1, 1, 1];
        let score = ScoreTrait::yahtzee(dices.span());
        assert_eq!(score, YAHTZEE);
    }

    #[test]
    fn test_yahtzee_with_no_yahtzee() {
        let dices = array![1, 2, 3, 4, 5];
        let score = ScoreTrait::yahtzee(dices.span());
        assert_eq!(score, 0);
    }

    #[test]
    fn test_chance() {
        let dices = array![1, 2, 3, 4, 5];
        let score = ScoreTrait::chance(dices.span());
        assert_eq!(score, 15);
    }
}