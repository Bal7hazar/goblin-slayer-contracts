import { RPCProvider } from "@dojoengine/core";
import { Account } from "starknet";

interface Signer {
    account: Account;
}

export interface CreateProps extends Signer {
    name: string;
}

export class Slayer extends RPCProvider {
    private contracts: { [key: string]: string };

    constructor(worldAddress: string, manifest?: any, url?: string) {
        super(worldAddress, manifest, url);

        this.contracts = { slayer: "slayer" };
    }

    public async create(props: CreateProps): Promise<any> {
        try {
            return await this.execute(
                props.account,
                this.contracts.slayer,
                "create",
                [props.name]
            );
        } catch (error) {
            console.error("Error in creating entity:", error);
            throw error;
        }
    }
}
