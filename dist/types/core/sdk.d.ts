import { Markets } from "./markets";
import { Accounts } from "./accounts";
import { Orders } from "./orders";
import { PostTradeDetails } from "./post-trade-details";
import { SDKConfig, NetworkConfig } from "../config";
import { IAccountAPIResponse } from "../types";
/**
 * Internal SDK config type - all fields are required
 */
type InternalSDKConfig = Required<SDKConfig>;
/**
 * Main Polynomial SDK class
 */
export declare class PolynomialSDK {
    private readonly config;
    private readonly networkConfig;
    private readonly httpClient;
    private readonly orderbookClient;
    private readonly walletAddress;
    private readonly sessionKey;
    private accountId;
    readonly markets: Markets;
    readonly accounts: Accounts;
    readonly orders: Orders;
    readonly postTradeDetails: PostTradeDetails;
    private constructor();
    /**
     * Gets the account ID that was fetched from the API during initialization
     */
    private getAccountId;
    /**
     * Creates a new SDK instance with the provided configuration
     * Fetches the account ID from the API during initialization
     */
    static create(config: SDKConfig): Promise<PolynomialSDK>;
    /**
     * Gets the current configuration
     */
    getConfig(): Readonly<InternalSDKConfig>;
    /**
     * Gets the network configuration
     */
    getNetworkConfig(): Readonly<NetworkConfig>;
    /**
     * Updates the API key
     */
    updateApiKey(newApiKey: string): void;
    /**
     * Simple convenience method to create an order with minimal parameters
     * Only marketId and size are required, everything else uses sensible defaults
     * Uses the sessionKey and walletAddress provided during SDK initialization
     */
    createOrder(marketId: string, size: bigint, options?: {
        isLong?: boolean;
        acceptablePrice?: bigint;
        reduceOnly?: boolean;
        slippagePercentage?: bigint;
    }): Promise<any>;
    /**
     * Simple convenience method to create a limit order with minimal parameters
     * Requires marketId, size, and acceptablePrice (limit price)
     * Uses the sessionKey and walletAddress provided during SDK initialization
     */
    createLimitOrder(marketId: string, size: bigint, acceptablePrice: bigint, options?: {
        isLong?: boolean;
        reduceOnly?: boolean;
    }): Promise<any>;
    /**
     * Convenience method to create a long position limit order
     * Uses the sessionKey and walletAddress provided during SDK initialization
     */
    createLimitLongOrder(marketId: string, size: bigint, acceptablePrice: bigint, reduceOnly?: boolean): Promise<any>;
    /**
     * Convenience method to create a short position limit order
     * Uses the sessionKey and walletAddress provided during SDK initialization
     */
    createLimitShortOrder(marketId: string, size: bigint, acceptablePrice: bigint, reduceOnly?: boolean): Promise<any>;
    /**
     * Convenience method to get account summary with positions
     * Uses the walletAddress provided during SDK initialization
     */
    getAccountSummary(): Promise<{
        account: IAccountAPIResponse;
        positions: import("../types").IPosition[];
        totalPositions: number;
        totalUnrealizedPnl: string;
        totalRealizedPnl: string;
    }>;
    /**
     * Convenience method to get market data with statistics
     */
    getMarketData(symbol?: string): Promise<import("../types").IMarkets[] | Partial<import("../types").IMarkets> | null>;
    /**
     * Convenience method to get margin information for the stored account
     * Uses the walletAddress provided during SDK initialization
     */
    getMarginInfo(): Promise<import("../types").IMarginInfoSummary>;
    /**
     * Convenience method to get maximum possible trade sizes for a market
     * Uses the walletAddress provided during SDK initialization
     */
    getMaxPossibleTradeSizes(marketId: string): Promise<import("../types").IMaxTradeSizeResponse>;
    /**
     * Get post-trade details for a market order using stored credentials
     */
    getPostTradeDetails(marketId: string, sizeDelta: string): Promise<any>;
    /**
     * Get post-trade details for a limit order using stored credentials
     */
    getPostTradeDetailsLimit(marketId: string, sizeDelta: string, limitPrice: string): Promise<any>;
    /**
     * Check if a market trade is feasible using stored credentials
     */
    isTradeFeasible(marketId: string, sizeDelta: string): Promise<boolean>;
    /**
     * Check if a limit trade is feasible using stored credentials
     */
    isLimitTradeFeasible(marketId: string, sizeDelta: string, limitPrice: string): Promise<boolean>;
}
export {};
//# sourceMappingURL=sdk.d.ts.map