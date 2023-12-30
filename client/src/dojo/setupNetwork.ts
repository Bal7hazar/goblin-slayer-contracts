import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { Account, num } from "starknet";
import * as torii from "@dojoengine/torii-client";
import { Slayer } from "./generated/Slayer";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

async function loadManifest() {
    try {
        if (import.meta.env.VITE_PUBLIC_DEV) {
            const devManifest = await import(
                "../../../contracts/target/dev/manifest.json"
            );
            return devManifest;
        }
    } catch (error) {
        console.warn(
            "Development manifest not found, using production manifest."
        );
    }
    return import("./manifest.json");
}

export async function setupNetwork() {
    // Extract environment variables for better readability.
    const {
        VITE_PUBLIC_WORLD_ADDRESS,
        VITE_PUBLIC_NODE_URL,
        VITE_PUBLIC_TORII,
    } = import.meta.env;

    // Create a new RPCProvider instance.
    const manifest = await loadManifest();
    const provider = new Slayer(
        VITE_PUBLIC_WORLD_ADDRESS,
        manifest,
        VITE_PUBLIC_NODE_URL
    );

    const toriiClient = await torii.createClient([], {
        rpcUrl: VITE_PUBLIC_NODE_URL,
        toriiUrl: VITE_PUBLIC_TORII,
        worldAddress: VITE_PUBLIC_WORLD_ADDRESS,
    });

    // const { account, burnerManager } = await createBurner();
    return {
        // dojo provider from core
        provider,

        // recs world
        world,

        toriiClient,
        // account,
        // burnerManager,

        // Define contract components for the world.
        contractComponents: defineContractComponents(world),

        // Execute function.
        execute: async (
            signer: Account,
            contract: string,
            system: string,
            call_data: num.BigNumberish[]
        ) => {
            return provider.execute(signer, contract, system, call_data);
        },
    };
}
