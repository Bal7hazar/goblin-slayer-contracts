import { SetupNetworkResult } from "./setupNetwork";
import { ClientComponents } from "./createClientComponents";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { provider, contractComponents }: SetupNetworkResult,
    { Slayer, Duel }: ClientComponents
) {
    // add overrides here.
    return {};
}
