import { RPCProvider } from "@dojoengine/core";
import { Account } from "starknet";

interface Signer {
    account: Account;
}

export interface CreateProps extends Signer {
    name: string;
}

export interface SeekProps extends Signer {
    name: string;
}

export interface RollProps extends Signer {
    orders: string;
}

export interface BuyProps extends Signer {
    item: string;
}

export interface ApplyProps extends Signer {
    item: string;
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
    seek: (props: Signer) => Promise<any>;
    roll: (props: RollProps) => Promise<any>;
    buy: (props: BuyProps) => Promise<any>;
    apply: (props: ApplyProps) => Promise<any>;
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
                [this.slayer.getWorldAddress(), props.name]
            );
        } catch (error) {
            console.error("Error in creating entity:", error);
            throw error;
        }
    }

    async seek(props: Signer): Promise<any> {
        try {
            return await this.slayer.execute(
                props.account,
                this.name,
                "seek",
                []
            );
        } catch (error) {
            console.error("Error in seeking entity:", error);
            throw error;
        }
    }

    async roll(props: RollProps): Promise<any> {
        try {
            return await this.slayer.execute(props.account, this.name, "roll", [
                props.orders,
            ]);
        } catch (error) {
            console.error("Error in rolling entity:", error);
            throw error;
        }
    }

    async buy(props: BuyProps): Promise<any> {
        try {
            return await this.slayer.execute(props.account, this.name, "buy", [
                props.item,
            ]);
        } catch (error) {
            console.error("Error in buying entity:", error);
            throw error;
        }
    }

    async apply(props: ApplyProps): Promise<any> {
        try {
            return await this.slayer.execute(
                props.account,
                this.name,
                "apply",
                [props.item]
            );
        } catch (error) {
            console.error("Error in applying entity:", error);
            throw error;
        }
    }
}
