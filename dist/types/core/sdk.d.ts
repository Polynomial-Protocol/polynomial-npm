import { Markets } from "./markets";
import { Accounts } from "./accounts";
import { Orders } from "./orders";
import { SDKConfig, NetworkConfig } from "../config";
/**
 * Main Polynomial SDK class
 */
export declare class PolynomialSDK {
    private readonly config;
    private readonly networkConfig;
    private readonly httpClient;
    private readonly orderbookClient;
    readonly markets: Markets;
    readonly accounts: Accounts;
    readonly orders: Orders;
    constructor(config: SDKConfig);
    /**
     * Creates a new SDK instance with the provided configuration
     */
    static create(config: SDKConfig): PolynomialSDK;
    /**
     * Gets the current configuration
     */
    getConfig(): Readonly<Required<SDKConfig>>;
    /**
     * Gets the network configuration
     */
    getNetworkConfig(): Readonly<NetworkConfig>;
    /**
     * Updates the API key
     */
    updateApiKey(newApiKey: string): void;
    /**
     * Convenience method to create a market order with trade simulation
     */
    createMarketOrderWithSimulation(sessionKey: string, walletAddress: string, marketSymbol: string, size: bigint, isLong: boolean, maxSlippage?: bigint): Promise<{
        simulation: any;
        orderResult: any;
    }>;
    /**
     * Convenience method to get account summary with positions
     */
    getAccountSummary(walletAddress: string): Promise<{
        account: import("..").IAccountAPIResponse;
        positions: import("..").IPosition[];
        totalPositions: number;
        totalUnrealizedPnl: string;
        totalRealizedPnl: string;
    }>;
    /**
     * Convenience method to get market data with statistics
     */
    getMarketData(symbol?: string): Promise<import("..").IMarkets[] | Partial<import("..").IMarkets> | null>;
}
//# sourceMappingURL=sdk.d.ts.map