import { HttpClient } from "./http";
import { OrderParams, LimitOrderParams } from "../types";
import { NetworkConfig } from "../config";
/**
 * Orders module for handling order creation and submission
 */
export declare class Orders {
    private readonly httpClient;
    private readonly orderbookClient;
    private readonly networkConfig;
    private readonly sessionKey;
    private readonly walletAddress;
    private readonly getAccountId;
    constructor(httpClient: HttpClient, orderbookClient: HttpClient, networkConfig: NetworkConfig, sessionKey: string, walletAddress: string, getAccountId: () => string);
    /**
     * Fetches current market price for a given market ID
     */
    private getMarketPrice;
    /**
     * Signs a market order using EIP-712 typed data
     */
    private signMarketOrder;
    /**
     * Submits a signed market order to the orderbook endpoint
     */
    private submitMarketOrder;
    /**
     * Creates and submits a market order using stored credentials
     */
    createMarketOrder(params: OrderParams, defaultSlippage?: bigint): Promise<any>;
    /**
     * Creates a simple market order with minimal parameters
     * All other values will be calculated automatically or use defaults
     */
    createOrder(marketId: string, size: bigint, options?: {
        isLong?: boolean;
        acceptablePrice?: bigint;
        reduceOnly?: boolean;
        slippagePercentage?: bigint;
    }): Promise<any>;
    /**
     * Creates a long position market order
     */
    createLongOrder(marketId: string, size: bigint, acceptablePrice?: bigint, reduceOnly?: boolean): Promise<any>;
    /**
     * Creates a short position market order
     */
    createShortOrder(marketId: string, size: bigint, acceptablePrice?: bigint, reduceOnly?: boolean): Promise<any>;
    /**
     * Helper method to calculate acceptable price with slippage
     */
    calculateAcceptablePriceWithSlippage(marketPrice: bigint, slippagePercentage: bigint, isLong: boolean): bigint;
    /**
     * Signs a limit order using EIP-712 typed data
     */
    private signLimitOrder;
    /**
     * Submits a signed limit order to the orderbook endpoint
     */
    private submitLimitOrder;
    /**
     * Creates and submits a limit order using stored credentials
     */
    createLimitOrder(params: LimitOrderParams): Promise<any>;
    /**
     * Creates a simple limit order with minimal parameters
     * All other values will be calculated automatically or use defaults
     */
    createLimitOrderSimple(marketId: string, size: bigint, acceptablePrice: bigint, options?: {
        isLong?: boolean;
        reduceOnly?: boolean;
    }): Promise<any>;
    /**
     * Creates a long position limit order
     */
    createLimitLongOrder(marketId: string, size: bigint, acceptablePrice: bigint, reduceOnly?: boolean): Promise<any>;
    /**
     * Creates a short position limit order
     */
    createLimitShortOrder(marketId: string, size: bigint, acceptablePrice: bigint, reduceOnly?: boolean): Promise<any>;
}
//# sourceMappingURL=orders.d.ts.map