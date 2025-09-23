import { HttpClient } from "./http";
import { OrderParams } from "../types";
import { NetworkConfig } from "../config";
/**
 * Orders module for handling order creation and submission
 */
export declare class Orders {
    private readonly httpClient;
    private readonly orderbookClient;
    private readonly networkConfig;
    constructor(httpClient: HttpClient, orderbookClient: HttpClient, networkConfig: NetworkConfig);
    /**
     * Signs a market order using EIP-712 typed data
     */
    private signMarketOrder;
    /**
     * Submits a signed market order to the orderbook endpoint
     */
    private submitMarketOrder;
    /**
     * Creates and submits a market order
     */
    createMarketOrder(sessionKey: string, walletAddress: string, accountId: string, params: OrderParams, defaultSlippage?: bigint): Promise<any>;
    /**
     * Creates a long position market order
     */
    createLongOrder(sessionKey: string, walletAddress: string, accountId: string, marketId: string, size: bigint, acceptablePrice: bigint, reduceOnly?: boolean): Promise<any>;
    /**
     * Creates a short position market order
     */
    createShortOrder(sessionKey: string, walletAddress: string, accountId: string, marketId: string, size: bigint, acceptablePrice: bigint, reduceOnly?: boolean): Promise<any>;
    /**
     * Helper method to calculate acceptable price with slippage
     */
    calculateAcceptablePriceWithSlippage(marketPrice: bigint, slippagePercentage: bigint, isLong: boolean): bigint;
}
//# sourceMappingURL=orders.d.ts.map