export interface Transaction {
    _id: string;
    amount: number;
    type: "deposit" | "withdraw" | "stake-won" | "stake-lost";
    createdAt: string;
}


export interface WalletData {
    total_amount: number;
}

export interface BetData {
    _id: string;
    stake: number;
    prediction: "heads" | "tails";
    spin_id: string;
    outcome: "heads" | "tails";
    createdAt: string;
}
export interface UserData {
    _id?: string;
    id?: string;
    role?: string
    phone_number?: number;
    username?: string;
    createdAt?: string;
    avatar?: string;
}


