import { SetupNetworkResult } from "./setupNetwork";
import { ClientComponents } from "./createClientComponents";
import { CreateProps } from "./generated/Slayer";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { provider, contractComponents }: SetupNetworkResult,
    { Position, Moves }: ClientComponents
) {
    return {
        create: async (props: CreateProps) => {
            await provider.create({ account: props.account, name: props.name });
        },
    };
}
