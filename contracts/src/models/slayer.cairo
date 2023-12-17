// Core imports

use core::array::ArrayTrait;
use core::traits::TryInto;
use dict::{Felt252Dict, Felt252DictTrait};

// Constants

const TWO_POW_8: u256 = 0x100;
const MASK_8: u256 = 0xff;
const ITEM_COUNT: u8 = 2;

// Errors

mod errors {
    const SLAYER_NAME_MUST_BE_NON_ZERO: felt252 = 'Slayer: name must be non zero';
    const SLAYER_NOT_ENOUGH_ITEM: felt252 = 'Slayer: not enough item';
    const SLAYER_TOO_MUCH_ITEMS_TO_PACK: felt252 = 'Slayer: too much items to pack';
}

#[derive(Serde, Copy, Drop)]
enum Item {
    ExtraRound,
    ExtraDice,
}

impl ItemIntoU32 of Into<Item, u32> {
    #[inline(always)]
    fn into(self: Item) -> u32 {
        match self {
            Item::ExtraRound => 0,
            Item::ExtraDice => 1,
        }
    }
}

#[derive(Model, Copy, Drop, Serde)]
struct Slayer {
    #[key]
    id: felt252,
    name: felt252,
    xp: u128,
    gold: u128,
    duel_id: u32,
    items: felt252,
}

trait SlayerTrait {
    fn new(id: felt252, name: felt252) -> Slayer;
    fn sub(ref self: Slayer, item: Item);
    fn add(ref self: Slayer, item: Item);
}

impl SlayerImpl of SlayerTrait {
    #[inline(always)]
    fn new(id: felt252, name: felt252) -> Slayer {
        // [Check] Name must be non zero
        assert(name != '', errors::SLAYER_NAME_MUST_BE_NON_ZERO);
        Slayer { id: id, name: name, xp: 0, gold: 0, duel_id: 0, items: 0 }
    }

    #[inline(always)]
    fn sub(ref self: Slayer, item: Item) {
        // [Check] Count must be positive
        let mut items: Array<u8> = PrivateTrait::unpack(self.items.into());
        let item_index: u32 = item.into();
        let count = *items.at(item_index);
        assert(count > 0, errors::SLAYER_NOT_ENOUGH_ITEM);
        // [Effect] Update item count
        PrivateTrait::insert(ref items, item_index, count - 1);
        // [Effect] Update items
        self.items = PrivateTrait::pack(items.span());
    }

    #[inline(always)]
    fn add(ref self: Slayer, item: Item) {
        // [Check] Count must be positive
        let mut items: Array<u8> = PrivateTrait::unpack(self.items.into());
        let item_index: u32 = item.into();
        let count = *items.at(item_index);
        // [Effect] Update item count
        PrivateTrait::insert(ref items, item_index, count + 1);
        // [Effect] Update items
        self.items = PrivateTrait::pack(items.span());
    }
}

#[generate_trait]
impl PrivateImpl of PrivateTrait {
    fn unpack(mut packed: u256) -> Array<u8> {
        let mut unpacked: Array<u8> = array![];
        let mut index: felt252 = 0;
        loop {
            if index == ITEM_COUNT.into() {
                break;
            }
            let count: u8 = (packed & MASK_8).try_into().unwrap();
            unpacked.append(count);
            packed /= TWO_POW_8;
            index += 1;
        };
        unpacked
    }

    fn pack(mut unpacked: Span<u8>) -> felt252 {
        let mut packed: u256 = 0;
        let mut index: u32 = ITEM_COUNT.into();
        loop {
            index -= 1;
            let count: u8 = *unpacked.at(index);
            packed += count.into();
            if index == 0 {
                break;
            }
            packed *= TWO_POW_8;
        };
        packed.try_into().expect(errors::SLAYER_TOO_MUCH_ITEMS_TO_PACK)
    }

    fn insert(ref array: Array<u8>, index: u32, value: u8) {
        let max_idx: felt252 = array.len().into();
        let mut idx = 0;
        loop {
            if max_idx == idx.into() {
                break;
            }
            let array_value = array.pop_front().unwrap();
            if idx == index {
                array.append(value);
            } else {
                array.append(array_value);
            }
            idx += 1;
        };
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use debug::PrintTrait;

    // Local imports

    use super::{Slayer, SlayerTrait, Item};

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
        assert_eq!(slayer.duel_id, 0);
        assert_eq!(slayer.items, 0);
    }

    #[test]
    fn test_slayer_add() {
        let mut slayer = SlayerTrait::new(ID, NAME);
        slayer.add(Item::ExtraRound);
        assert_eq!(slayer.items, 0x1);
        slayer.add(Item::ExtraRound);
        assert_eq!(slayer.items, 0x2);
        slayer.add(Item::ExtraDice);
        assert_eq!(slayer.items, 0x102);
    }

    #[test]
    fn test_bag_add_reverse() {
        let mut slayer = SlayerTrait::new(ID, NAME);
        slayer.add(Item::ExtraDice);
        assert_eq!(slayer.items, 0x100);
        slayer.add(Item::ExtraRound);
        assert_eq!(slayer.items, 0x101);
        slayer.add(Item::ExtraRound);
        assert_eq!(slayer.items, 0x102);
    }

    #[test]
    fn test_bag_sub() {
        let mut slayer = SlayerTrait::new(ID, NAME);
        slayer.add(Item::ExtraRound);
        slayer.add(Item::ExtraRound);
        slayer.add(Item::ExtraDice);
        slayer.sub(Item::ExtraRound);
        assert_eq!(slayer.items, 0x101);
        slayer.sub(Item::ExtraRound);
        assert_eq!(slayer.items, 0x100);
        slayer.sub(Item::ExtraDice);
        assert_eq!(slayer.items, 0x0);
    }
}
