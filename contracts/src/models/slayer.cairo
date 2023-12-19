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
    const SLAYER_NOT_ENOUGH_GOLD: felt252 = 'Slayer: not enough gold';
    const SLAYER_NOT_ENOUGH_ITEM: felt252 = 'Slayer: not enough item';
    const SLAYER_TOO_MUCH_ITEMS_TO_PACK: felt252 = 'Slayer: too much items to pack';
}

#[derive(Serde, Copy, Drop, PartialEq)]
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

#[derive(Copy, Drop)]
enum Tag {
    Unknown, // 0xp+
    Porcelain, // 64xp+
    Obsidian, // 128xp+
    Steel, // 256xp+
    Sapphire, // 512xp+
    Emerald, // 1024xp+
    Ruby, // 2048xp+
    Bronze, // 4096xp+
    Silver, // 8192xp+
    Gold, // 16384xp+
    Platinium, // 32768xp+
}

impl U128IntoTag of Into<u128, Tag> {
    #[inline(always)]
    fn into(self: u128) -> Tag {
        if self >= 32768 {
            Tag::Platinium
        } else if self >= 16384 {
            Tag::Gold
        } else if self >= 8192 {
            Tag::Silver
        } else if self >= 4096 {
            Tag::Bronze
        } else if self >= 2048 {
            Tag::Ruby
        } else if self >= 1024 {
            Tag::Emerald
        } else if self >= 512 {
            Tag::Sapphire
        } else if self >= 256 {
            Tag::Steel
        } else if self >= 128 {
            Tag::Obsidian
        } else if self >= 64 {
            Tag::Porcelain
        } else {
            Tag::Unknown
        }
    }
}

impl TagIntoU8 of Into<Tag, u8> {
    #[inline(always)]
    fn into(self: Tag) -> u8 {
        match self {
            Tag::Unknown => 0,
            Tag::Porcelain => 1,
            Tag::Obsidian => 2,
            Tag::Steel => 3,
            Tag::Sapphire => 4,
            Tag::Emerald => 5,
            Tag::Ruby => 6,
            Tag::Bronze => 7,
            Tag::Silver => 8,
            Tag::Gold => 9,
            Tag::Platinium => 10,
        }
    }
}

#[derive(Copy, Drop)]
enum Title {
    Frugal, // 0gold+
    Steady, // 64gold+
    Thriving, // 128gold+
    Flourishing, // 256gold+
    Prosperous, // 512gold+
    Affluent, // 1024gold+
    Wealthy, // 2048gold+
    Opulent, // 4096gold+
    Luxurious, // 8192gold+
    Regal, // 16384gold+
    Sovereign, // 32768gold+
}

impl U128IntoTitle of Into<u128, Title> {
    #[inline(always)]
    fn into(self: u128) -> Title {
        if self >= 32768 {
            Title::Sovereign
        } else if self >= 16384 {
            Title::Regal
        } else if self >= 8192 {
            Title::Luxurious
        } else if self >= 4096 {
            Title::Opulent
        } else if self >= 2048 {
            Title::Wealthy
        } else if self >= 1024 {
            Title::Affluent
        } else if self >= 512 {
            Title::Prosperous
        } else if self >= 256 {
            Title::Flourishing
        } else if self >= 128 {
            Title::Thriving
        } else if self >= 64 {
            Title::Steady
        } else {
            Title::Frugal
        }
    }
}

impl TitleIntoU8 of Into<Title, u8> {
    #[inline(always)]
    fn into(self: Title) -> u8 {
        match self {
            Title::Frugal => 0,
            Title::Steady => 1,
            Title::Thriving => 2,
            Title::Flourishing => 3,
            Title::Prosperous => 4,
            Title::Affluent => 5,
            Title::Wealthy => 6,
            Title::Opulent => 7,
            Title::Luxurious => 8,
            Title::Regal => 9,
            Title::Sovereign => 10,
        }
    }
}

#[derive(Model, Copy, Drop, Serde)]
struct Slayer {
    #[key]
    id: felt252,
    name: felt252,
    tag: u8,
    title: u8,
    xp: u128,
    gold: u128,
    duel_id: u32,
    items: felt252,
}

trait SlayerTrait {
    fn new(id: felt252, name: felt252) -> Slayer;
    fn reset(ref self: Slayer);
    fn train(ref self: Slayer, xp: u128);
    fn earn(ref self: Slayer, gold: u128);
    fn spend(ref self: Slayer, gold: u128);
    fn sub(ref self: Slayer, item: Item);
    fn add(ref self: Slayer, item: Item);
}

impl SlayerImpl of SlayerTrait {
    #[inline(always)]
    fn new(id: felt252, name: felt252) -> Slayer {
        // [Check] Name must be non zero
        assert(name != '', errors::SLAYER_NAME_MUST_BE_NON_ZERO);
        Slayer { id: id, name: name, tag: 0, title: 0, xp: 0, gold: 0, duel_id: 0, items: 0 }
    }

    #[inline(always)]
    fn reset(ref self: Slayer) {
        // [Effect] Reset slayer
        self.xp = 0;
        self.gold = 0;
        self.title = 0;
        self.tag = 0;
        self.duel_id = 0;
        self.items = 0;
    }

    #[inline(always)]
    fn train(ref self: Slayer, xp: u128) {
        // [Effect] Update xp
        self.xp += xp;
        // [Effect] Update tag
        let tag: Tag = self.xp.into();
        self.tag = tag.into();
    }

    #[inline(always)]
    fn earn(ref self: Slayer, gold: u128) {
        // [Effect] Update gold
        self.gold += gold;
        // [Effect] Update title
        let title: Title = self.gold.into();
        self.title = title.into();
    }

    #[inline(always)]
    fn spend(ref self: Slayer, gold: u128) {
        // [Check] Gold must be positive
        assert(gold <= self.gold, errors::SLAYER_NOT_ENOUGH_GOLD);
        // [Effect] Update gold
        self.gold -= gold;
        // [Effect] Update title
        let title: Title = self.gold.into();
        self.title = title.into();
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
        assert_eq!(slayer.tag, 0);
        assert_eq!(slayer.title, 0);
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
