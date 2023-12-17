//! This is an alternative version using Dict more elegant but less gas efficient.

// Core imports

use core::traits::TryInto;
use dict::{Felt252Dict, Felt252DictTrait};

// Constants

const TWO_POW_8: u256 = 0x100;
const MASK_8: u256 = 0xff;
const ITEM_COUNT: u8 = 2; // Must be <= 31

// Errors

mod errors {
    const BAG_NOT_ENOUGH_ITEM: felt252 = 'Bag: not enough item';
    const BAG_TOO_MUCH_ITEMS_TO_PACK: felt252 = 'Bag: too much items to pack';
}

#[derive(Drop)]
enum Item {
    ExtraRound,
    ExtraDice,
}

impl ItemIntoFelt252 of Into<Item, felt252> {
    #[inline(always)]
    fn into(self: Item) -> felt252 {
        match self {
            Item::ExtraRound => 0,
            Item::ExtraDice => 1,
        }
    }
}

#[derive(Model, Copy, Drop, Serde)]
struct Bag {
    #[key]
    id: felt252,
    items: felt252,
}

trait BagTrait {
    fn new(id: felt252) -> Bag;
    fn sub(ref self: Bag, item: Item);
    fn add(ref self: Bag, item: Item);
}

impl BagImpl of BagTrait {
    #[inline(always)]
    fn new(id: felt252) -> Bag {
        Bag { id: id, items: 0 }
    }

    #[inline(always)]
    fn sub(ref self: Bag, item: Item) {
        // [Check] Count must be positive
        let mut items: Felt252Dict<u8> = PrivateTrait::unpack(self.items.into());
        let item_key: felt252 = item.into();
        let count = items.get(item_key);
        assert(count > 0, errors::BAG_NOT_ENOUGH_ITEM);
        // [Effect] Update item count
        items.insert(item_key, count - 1);
        // [Effect] Update items
        self.items = PrivateTrait::pack(ref items);
    }

    #[inline(always)]
    fn add(ref self: Bag, item: Item) {
        // [Check] Count must be positive
        let mut items: Felt252Dict<u8> = PrivateTrait::unpack(self.items.into());
        let item_key: felt252 = item.into();
        let count = items.get(item_key);
        // [Effect] Update item count
        items.insert(item_key, count + 1);
        // [Effect] Update items
        self.items = PrivateTrait::pack(ref items);
    }
}

#[generate_trait]
impl PrivateImpl of PrivateTrait {
    fn unpack(mut packed: u256) -> Felt252Dict<u8> {
        let mut unpacked: Felt252Dict<u8> = Default::default();
        let mut index: felt252 = 0;
        loop {
            if index == ITEM_COUNT.into() {
                break;
            }
            let count: u8 = (packed & MASK_8).try_into().unwrap();
            unpacked.insert(index, count);
            packed /= TWO_POW_8;
            index += 1;
        };
        unpacked
    }

    fn pack(ref unpacked: Felt252Dict<u8>) -> felt252 {
        let mut packed: u256 = 0;
        let mut index: felt252 = ITEM_COUNT.into();
        loop {
            index -= 1;
            let count: u8 = unpacked.get(index);
            packed += count.into();
            if index == 0 {
                break;
            }
            packed *= TWO_POW_8;
        };
        packed.try_into().expect(errors::BAG_TOO_MUCH_ITEMS_TO_PACK)
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use debug::PrintTrait;

    // Local imports

    use super::{Bag, BagTrait, Item};

    // Constants

    const ID: felt252 = 'ID';

    #[test]
    fn test_bag_new() {
        let bag = BagTrait::new(ID);
        assert_eq!(bag.id, ID);
        assert_eq!(bag.items, 0);
    }

    #[test]
    fn test_bag_add() {
        let mut bag = BagTrait::new(ID);
        bag.add(Item::ExtraRound);
        assert_eq!(bag.items, 0x1);
        bag.add(Item::ExtraRound);
        assert_eq!(bag.items, 0x2);
        bag.add(Item::ExtraDice);
        assert_eq!(bag.items, 0x102);
    }

    #[test]
    fn test_bag_add_reverse() {
        let mut bag = BagTrait::new(ID);
        bag.add(Item::ExtraDice);
        assert_eq!(bag.items, 0x100);
        bag.add(Item::ExtraRound);
        assert_eq!(bag.items, 0x101);
        bag.add(Item::ExtraRound);
        assert_eq!(bag.items, 0x102);
    }

    #[test]
    fn test_bag_sub() {
        let mut bag = BagTrait::new(ID);
        bag.add(Item::ExtraRound);
        bag.add(Item::ExtraRound);
        bag.add(Item::ExtraDice);
        bag.sub(Item::ExtraRound);
        assert_eq!(bag.items, 0x101);
        bag.sub(Item::ExtraRound);
        assert_eq!(bag.items, 0x100);
        bag.sub(Item::ExtraDice);
        assert_eq!(bag.items, 0x0);
    }
}
