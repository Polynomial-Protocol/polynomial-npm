import { HttpClient } from "./http";
import { IAccountAPIResponse, IPosition, IMarginInfoSummary, IMaxTradeSizeResponse } from "../types";
/**
 * Accounts module for handling account management operations
 */
export declare class Accounts {
    private readonly httpClient;
    private readonly chainId;
    private readonly walletAddress;
    private readonly getAccountId;
    constructor(httpClient: HttpClient, chainId: number, walletAddress: string, getAccountId: () => string);
    /**
     * Fetches account information for a given wallet address
     */
    getAccount(walletAddress: string): Promise<IAccountAPIResponse | null>;
    /**
     * Gets all positions for a specific wallet address
     */
    getPositionsForWallet(walletAddress: string): Promise<IPosition[]>;
    /**
     * Gets a specific position by market ID
     */
    getPositionByMarketForWallet(walletAddress: string, marketId: string): Promise<IPosition | null>;
    /**
     * Gets account summary including positions and key metrics
     */
    getAccountSummaryForWallet(walletAddress: string): Promise<{
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
    /**
     * Gets all positions for the stored account using wallet address
     */
    getPositions(): Promise<IPosition[]>;
    /**
     * Gets a specific position by market ID for the stored account
     */
    getPositionByMarket(marketId: string): Promise<IPosition | null>;
    /**
     * Gets account summary for the stored account
     */
    getAccountSummary(): Promise<{
        account: IAccountAPIResponse;
        positions: IPosition[];
        totalPositions: number;
        totalUnrealizedPnl: string;
        totalRealizedPnl: string;
    }>;
    /**
     * Gets margin information for a specific wallet address
     */
    getMarginInfoForWallet(walletAddress: string): Promise<IMarginInfoSummary>;
    /**
     * Gets margin information for the stored account
     */
    getMarginInfo(): Promise<IMarginInfoSummary>;
    /**
     * Gets maximum possible trade sizes for a specific market and account
     */
    getMaxPossibleTradeSizesForWallet(walletAddress: string, marketId: string): Promise<IMaxTradeSizeResponse>;
    /**
     * Gets maximum possible trade sizes for a specific market using the stored account
     */
    getMaxPossibleTradeSizes(marketId: string): Promise<IMaxTradeSizeResponse>;
}
//# sourceMappingURL=accounts.d.ts.map