/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";

export function defineContractComponents(world: World) {
    return {
        Duel: (() => {
            return defineComponent(
                world,
                {
                    id: RecsType.Number,
                    slayer_id: RecsType.BigInt,
                    seed: RecsType.BigInt,
                    nonce: RecsType.BigInt,
                    round: RecsType.Number,
                    slayer_dices: RecsType.Number,
                    slayer_score: {
                        value: RecsType.Number,
                        max: RecsType.Number,
                        category: RecsType.Number,
                    },
                    goblin_dices: RecsType.Number,
                    goblin_score: {
                        value: RecsType.Number,
                        max: RecsType.Number,
                        category: RecsType.Number,
                    },
                    over: RecsType.Boolean,
                    round_count: RecsType.Number,
                    dice_count: RecsType.Number,
                },
                {
                    metadata: {
                        name: "Duel",
                        types: [
                            "u32",
                            "felt252",
                            "felt252",
                            "felt252",
                            "u8",
                            "u64",
                            "u32",
                            "u8",
                            "u8",
                            "u64",
                            "u32",
                            "u8",
                            "u8",
                            "bool",
                            "u8",
                            "u8",
                        ],
                        customTypes: ["Score", "Score"],
                    },
                }
            );
        })(),
        Slayer: (() => {
            return defineComponent(
                world,
                {
                    id: RecsType.BigInt,
                    name: RecsType.BigInt,
                    tag: RecsType.Number,
                    title: RecsType.Number,
                    xp: RecsType.BigInt,
                    gold: RecsType.BigInt,
                    duel_id: RecsType.Number,
                    items: RecsType.BigInt,
                },
                {
                    metadata: {
                        name: "Slayer",
                        types: [
                            "felt252",
                            "felt252",
                            "u8",
                            "u8",
                            "u128",
                            "u128",
                            "u32",
                            "felt252",
                        ],
                        customTypes: [],
                    },
                }
            );
        })(),
    };
}