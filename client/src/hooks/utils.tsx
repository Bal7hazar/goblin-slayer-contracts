export const getTag = (tag: number) => {
    switch (tag) {
        case 0:
            return "Starter";
        case 1:
            return "Porcelain";
        case 2:
            return "Obsidian";
        case 3:
            return "Steel";
        case 4:
            return "Sapphire";
        case 5:
            return "Emerald";
        case 6:
            return "Ruby";
        case 7:
            return "Bronze";
        case 8:
            return "Silver";
        case 9:
            return "Gold";
        case 10:
            return "Platinium";
        default:
            return "Unknown";
    }
};

export const getTitle = (title: number) => {
    switch (title) {
        case 0:
            return "Frugal";
        case 1:
            return "Steady";
        case 2:
            return "Thriving";
        case 3:
            return "Flourishing";
        case 4:
            return "Prosperous";
        case 5:
            return "Affluent";
        case 6:
            return "Wealthy";
        case 7:
            return "Opulent";
        case 8:
            return "Luxurious";
        case 9:
            return "Regal";
        case 10:
            return "Sovereign";
        default:
            return "Frugal";
    }
};

export const getRank = (rank: number) => {
    switch (rank) {
        case 0:
            return "Normal";
        case 1:
            return "Rider";
        case 2:
            return "Hobgoblin";
        case 3:
            return "Shaman";
        case 4:
            return "Champion";
        case 5:
            return "Lord";
        case 6:
            return "Paladin";
        default:
            return "Goblin";
    }
};
