import { SetupNetworkResult } from "./setupNetwork";
import { ClientComponents } from "./createClientComponents";
import {
    CreateProps,
    SeekProps,
    RollProps,
    BuyProps,
    ApplyProps,
} from "./generated/Slayer";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { provider, contractComponents }: SetupNetworkResult,
    { Slayer, Duel }: ClientComponents
) {
    return {
        create: async (props: CreateProps) => {
            await provider.create({ account: props.account, name: props.name });
        },
    };
}

export function seekSystemCalls(
    { provider, contractComponents }: SetupNetworkResult,
    { Slayer, Duel }: ClientComponents
) {
    return {
        seek: async (props: SeekProps) => {
            await provider.seek({ account: props.account });
        },
    };
}

export function rollSystemCalls(
    { provider, contractComponents }: SetupNetworkResult,
    { Slayer, Duel }: ClientComponents
) {
    return {
        roll: async (props: RollProps) => {
            await provider.roll({
                account: props.account,
                orders: props.orders,
            });
        },
    };
}

export function buySystemCalls(
    { provider, contractComponents }: SetupNetworkResult,
    { Slayer, Duel }: ClientComponents
) {
    return {
        buy: async (props: BuyProps) => {
            await provider.buy({ account: props.account, item: props.item });
        },
    };
}

export function applySystemCalls(
    { provider, contractComponents }: SetupNetworkResult,
    { Slayer, Duel }: ClientComponents
) {
    return {
        apply: async (props: ApplyProps) => {
            await provider.apply({ account: props.account, item: props.item });
        },
    };
}
