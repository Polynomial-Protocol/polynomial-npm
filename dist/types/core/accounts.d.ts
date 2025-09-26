import { HttpClient } from "./http";
import { IAccountAPIResponse, IPosition } from "../types";
/**
 * Accounts module for handling account management operations
 */
export declare class Accounts {
    private readonly httpClient;
    private readonly chainId;
    constructor(httpClient: HttpClient, chainId: number);
    /**
     * Fetches account information for a given wallet address
     */
    getAccount(walletAddress: string): Promise<IAccountAPIResponse | null>;
    /**
     * Gets all positions for a specific account
     */
    getPositions(accountId: string): Promise<IPosition[]>;
    /**
     * Gets a specific position by market ID
     */
    getPositionByMarket(accountId: string, marketId: string): Promise<IPosition | null>;
    /**
     * Gets account summary including positions and key metrics
     */
    getAccountSummary(walletAddress: string): Promise<{
        account: IAccountAPIResponse;
        positions: IPosition[];
        totalPositions: number;
        totalUnrealizedPnl: string;
        totalRealizedPnl: string;
    }>;
    /**
     * Checks if an account exists for a given wallet address
     */
    accountExists(walletAddress: string): Promise<boolean>;
    /**
     * Gets all accounts owned by a wallet address
     */
    getAllAccountsForWallet(walletAddress: string): Promise<IAccountAPIResponse[]>;
}
//# sourceMappingURL=accounts.d.ts.map