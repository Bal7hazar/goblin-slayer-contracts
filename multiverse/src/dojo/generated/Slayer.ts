import { DojoProvider } from "@dojoengine/core";
import { Account } from "starknet";

interface Signer {
    account: Account;
}

export interface CreateProps extends Signer {
    name: string;
}

export interface SeekProps extends Signer {}

export interface RollProps extends Signer {
    orders: number;
}

export interface BuyProps extends Signer {
    item: number;
}

export interface ApplyProps extends Signer {
    item: number;
}

export class Slayer extends DojoProvider {
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
            return await this.slayer.execute(props.account, this.name, "seek", [
                this.slayer.getWorldAddress(),
            ]);
        } catch (error) {
            console.error("Error in seeking entity:", error);
            throw error;
        }
    }

    async roll(props: RollProps): Promise<any> {
        try {
            return await this.slayer.execute(props.account, this.name, "roll", [
                this.slayer.getWorldAddress(),
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
                this.slayer.getWorldAddress(),
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
                [this.slayer.getWorldAddress(), props.item]
            );
        } catch (error) {
            console.error("Error in applying entity:", error);
            throw error;
        }
    }
}
