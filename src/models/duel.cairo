// Core imports

use core::array::ArrayTrait;
use core::traits::TryInto;
use core::integer::BoundedU8;

// External imports

use origami::random::dice::{Dice, DiceTrait};

// Internal imports

use slayer::constants::{DEFAULT_ROUND_COUNT, DEFAULT_DICE_COUNT, DICE_FACES_NUMBER};
use slayer::models::score::{Score, ScoreTrait, Category};

// Constants

const TWO_POW_8: u64 = 0x100;
const MASK_8: u64 = 0xff;
const MAX_DICE_COUNT: u8 = 8;

// Errors

mod errors {
    const DUEL_IS_OVER: felt252 = 'Duel: is over';
    const DUEL_INVALID_TURN: felt252 = 'Duel: invalid turn';
    const DUEL_INVALID_SEED: felt252 = 'Duel: invalid seed';
    const DUEL_MAX_DICE_COUNT_REACHED: felt252 = 'Duel: max dice count reached';
}

#[derive(Drop, PartialEq)]
enum Turn {
    None,
    Goblin,
    Slayer,
}

impl U8IntoTurn of Into<u8, Turn> {
    #[inline(always)]
    fn into(self: u8) -> Turn {
        let nonce = self % 2;
        if self == 0 {
            Turn::None
        } else if nonce == 1 {
            Turn::Goblin
        } else {
            Turn::Slayer
        }
    }
}

#[derive(Model, Copy, Drop, Serde)]
struct Duel {
    #[key]
    id: u32,
    #[key]
    slayer_id: felt252,
    seed: felt252,
    nonce: u8,
    slayer_dices: u64,
    goblin_dices: u64,
    slayer_score: u32,
    goblin_score: u32,
    over: bool,
    round_count: u8,
    dice_count: u8,
}

trait DuelTrait {
    fn new(id: u32, slayer_id: felt252, seed: felt252) -> Duel;
    fn start(ref self: Duel);
    fn play(ref self: Duel, orders: u8);
    fn add_round(ref self: Duel);
    fn add_dice(ref self: Duel);
}

impl DuelImpl of DuelTrait {
    fn new(id: u32, slayer_id: felt252, seed: felt252) -> Duel {
        assert(seed != 0, errors::DUEL_INVALID_SEED);
        Duel {
            id: id,
            slayer_id: slayer_id,
            seed: seed,
            nonce: 0,
            slayer_dices: 0,
            goblin_dices: 0,
            slayer_score: Zeroable::zero(),
            goblin_score: Zeroable::zero(),
            over: false,
            round_count: DEFAULT_ROUND_COUNT,
            dice_count: DEFAULT_DICE_COUNT,
        }
    }

    fn start(ref self: Duel) {
        // [Check] Duel not over
        assert(!self.over, errors::DUEL_IS_OVER);
        // [Check] Slayer turn
        let turn: Turn = self.nonce.into();
        assert(turn == Turn::None, errors::DUEL_INVALID_TURN);
        self.nonce += 1;
        // [Effect] Run Goblin turn
        let (dices, score) = self.roll(self.goblin_dices, BoundedU8::max());
        self.goblin_dices = dices;
        self.goblin_score = score.value;
    }

    fn play(ref self: Duel, orders: u8) {
        // [Check] Duel not over
        assert(!self.over, errors::DUEL_IS_OVER);
        // [Check] Slayer turn
        let turn: Turn = self.nonce.into();
        assert(turn == Turn::Slayer, errors::DUEL_INVALID_TURN);
        // [Effect] Roll slayer ordered dices
        let (dices, score) = self.roll(self.slayer_dices, orders);
        self.slayer_dices = dices;
        self.slayer_score = score.value;
        // [Effect] Roll goblin dices
        // FIXME: Reroll only relevant dices
        let (dices, score) = self.roll(self.goblin_dices, BoundedU8::max());
        self.goblin_dices = dices;
        self.goblin_score = score.value;
        // [Effect] Update duel state
        if self.nonce > 2 * self.round_count {
            self.over = true;
        }
    }
    fn add_round(ref self: Duel) {
        self.round_count += 1;
    }

    fn add_dice(ref self: Duel) {
        assert(self.dice_count < MAX_DICE_COUNT, errors::DUEL_MAX_DICE_COUNT_REACHED);
        self.dice_count += 1;
    }
}

#[generate_trait]
impl PrivateImpl of PrivateTrait {
    fn roll(ref self: Duel, packed_dices: u64, packed_orders: u8) -> (u64, Score) {
        // [Effect] Unpack dices to roll (true = roll, false = keep)
        let mut orders = PrivateTrait::unpack_orders(packed_orders, self.dice_count);
        // [Effect] Roll corresponding dices
        let mut dices = PrivateTrait::unpack_dices(packed_dices, self.dice_count);
        let mut dice = DiceTrait::new(DICE_FACES_NUMBER, self.seed);
        dice.nonce = self.nonce.into();
        loop {
            let dice_value = dices.pop_front().unwrap();
            match orders.pop_front() {
                Option::Some(order) => {
                    if order {
                        dices.append(dice.roll());
                    } else {
                        dices.append(dice_value);
                    }
                },
                Option::None => { break; },
            }
        };
        // [Effect] Increment nonce
        self.nonce += 1;

        // [Return] Packed dices and best score
        let score: Score = ScoreTrait::best(dices.span());
        let packed_dices = PrivateTrait::pack_dices(dices.span());
        (packed_dices, score)
    }

    fn unpack_dices(mut packed: u64, len: u8) -> Array<u8> {
        let mut index = len;
        let mut unpacked: Array<u8> = array![];
        loop {
            if index == 0 {
                break;
            }
            let value = packed & MASK_8;
            unpacked.append(value.try_into().unwrap());
            packed /= TWO_POW_8;
            index -= 1;
        };
        unpacked
    }

    fn pack_dices(mut unpacked: Span<u8>) -> u64 {
        let mut packed = 0;
        loop {
            match unpacked.pop_back() {
                Option::Some(value) => {
                    packed *= TWO_POW_8;
                    packed += (*value).into();
                },
                Option::None => { break; },
            }
        };
        packed
    }

    fn unpack_orders(mut packed: u8, len: u8) -> Array<bool> {
        let mut index = len;
        let mut unpacked: Array<bool> = array![];
        loop {
            if index == 0 {
                break;
            }
            let value: bool = packed & 1 == 1;
            unpacked.append(value);
            packed /= 2;
            index -= 1;
        };
        unpacked
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use debug::PrintTrait;
    use core::integer::BoundedU8;

    // Local imports

    use super::{Duel, DuelTrait, PrivateTrait, DEFAULT_ROUND_COUNT, DEFAULT_DICE_COUNT};

    // Constants

    const DUEL_ID: u32 = 1;
    const SLAYER_ID: felt252 = 'SLAYER_ID';
    const SEED: felt252 = 'SEED';

    #[test]
    fn test_duel_pack_dices() {
        let unpacked = array![1, 2, 3, 4, 5];
        let packed = PrivateTrait::pack_dices(unpacked.span());
        assert_eq!(packed, 0x0504030201);
    }

    #[test]
    fn test_duel_unpack_dices() {
        let packed = 0x0504030201;
        let unpacked = PrivateTrait::unpack_dices(packed, DEFAULT_DICE_COUNT);
        assert(unpacked == array![1, 2, 3, 4, 5], 'Unpack dices: wrong output');
    }

    #[test]
    fn test_duel_unpack_pack_dices() {
        let packed = 0x0504030201;
        let unpacked = PrivateTrait::unpack_dices(packed, DEFAULT_DICE_COUNT);
        assert_eq!(packed, PrivateTrait::pack_dices(unpacked.span()));
    }

    #[test]
    fn test_duel_unpack_orders() {
        let packed: u8 = 0x15; // 10101
        let unpacked = PrivateTrait::unpack_orders(packed, DEFAULT_DICE_COUNT);
        assert(unpacked == array![true, false, true, false, true], 'Unpack orders: wrong output');
    }

    #[test]
    fn test_duel_new() {
        let duel = DuelTrait::new(DUEL_ID, SLAYER_ID, SEED);
        assert(duel.slayer_id == SLAYER_ID, 'Duel: wrong slayer id');
        assert_eq!(duel.seed, SEED);
        assert_eq!(duel.nonce, 0);
        assert_eq!(duel.slayer_dices, 0);
        assert_eq!(duel.goblin_dices, 0);
        assert_eq!(duel.slayer_score, Zeroable::zero());
        assert_eq!(duel.goblin_score, Zeroable::zero());
        assert_eq!(duel.over, false);
    }

    #[test]
    fn test_duel_start() {
        let mut duel = DuelTrait::new(DUEL_ID, SLAYER_ID, SEED);
        duel.start();
        assert_eq!(duel.nonce, 2);
        assert_eq!(duel.slayer_dices, 0);
        assert(duel.goblin_dices != 0, 'Duel: wrong goblin dices');
        assert(duel.goblin_score != Zeroable::zero(), 'Duel: wrong goblin dices');
        assert_eq!(duel.over, false);
    }

    #[test]
    fn test_duel_play() {
        let mut duel = DuelTrait::new(DUEL_ID, SLAYER_ID, SEED);
        duel.start();
        let goblin_dices = duel.goblin_dices;
        duel.play(BoundedU8::max());
        assert_eq!(duel.nonce, 4);
        assert(duel.slayer_dices != 0, 'Duel: wrong slayer dices');
        assert(duel.goblin_dices != goblin_dices, 'Duel: wrong goblin dices');
        assert_eq!(duel.over, false);
    }

    #[test]
    fn test_duel_play_to_end() {
        let mut duel = DuelTrait::new(DUEL_ID, SLAYER_ID, SEED);
        duel.start();
        let mut index = DEFAULT_ROUND_COUNT;
        loop {
            if index == 0 {
                break;
            }
            duel.play(BoundedU8::max());
            index -= 1;
        };
    }

    #[test]
    #[should_panic(expected: ('Duel: is over',))]
    fn test_duel_play_revert_is_over() {
        let mut duel = DuelTrait::new(DUEL_ID, SLAYER_ID, SEED);
        duel.start();
        let mut index = DEFAULT_ROUND_COUNT;
        loop {
            if index == 0 {
                break;
            }
            duel.play(BoundedU8::max());
            index -= 1;
        };
        duel.play(BoundedU8::max());
    }

    #[test]
    #[should_panic(expected: ('Duel: invalid turn',))]
    fn test_duel_play_revert_invalid_turn() {
        let mut duel = DuelTrait::new(DUEL_ID, SLAYER_ID, SEED);
        duel.play(BoundedU8::max());
    }
}
