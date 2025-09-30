import { Markets } from "./markets";
import { Accounts } from "./accounts";
import { Orders } from "./orders";
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
}
export {};
//# sourceMappingURL=sdk.d.ts.map