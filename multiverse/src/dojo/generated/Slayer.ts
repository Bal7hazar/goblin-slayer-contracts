import { RPCProvider } from "@dojoengine/core";
import { Account } from "starknet";

interface Signer {
    account: Account;
}

export interface CreateProps extends Signer {
    name: string;
}

export class Slayer extends RPCProvider {
    public play: PlayContract;

    constructor(worldAddress: string, manifest?: any, url?: string) {
        super(worldAddress, manifest, url);

        this.play = new PlayContract(this);
    }
}

interface IPlayContractFunctions {
    create: (props: CreateProps) => Promise<any>;
}

export class PlayContract implements IPlayContractFunctions {
    private slayer: Slayer;
    private name: string;

    constructor(provider: Slayer) {
        this.slayer = provider;
        this.name = "play";
    }

    async create(props: CreateProps): Promise<any> {
        try {
            return await this.slayer.execute(
                props.account,
                this.name,
                "create",
                [props.name]
            );
        } catch (error) {
            console.error("Error in creating entity:", error);
            throw error;
        }
    }
}
