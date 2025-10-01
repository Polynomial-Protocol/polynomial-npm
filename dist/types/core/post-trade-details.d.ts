import { HttpClient } from "./http";
import { PostTradeDetailsRequest, PostTradeDetailsLimitRequest, PostTradeDetailsResponse } from "../types";
/**
 * Post Trade Details module for analyzing trade impact before execution
 */
export declare class PostTradeDetails {
    private readonly httpClient;
    private readonly chainId;
    constructor(httpClient: HttpClient, chainId: number);
    /**
     * Get post-trade details for a market order
     */
    getPostTradeDetails(params: PostTradeDetailsRequest): Promise<PostTradeDetailsResponse>;
    /**
     * Get post-trade details for a limit order
     */
    getPostTradeDetailsLimit(params: PostTradeDetailsLimitRequest): Promise<PostTradeDetailsResponse>;
    /**
     * Get post-trade details with account ID from stored credentials
     */
    getPostTradeDetailsForAccount(marketId: string, sizeDelta: string, getAccountId: () => string): Promise<PostTradeDetailsResponse>;
    /**
     * Get post-trade details for limit order with account ID from stored credentials
     */
    getPostTradeDetailsLimitForAccount(marketId: string, sizeDelta: string, limitPrice: string, getAccountId: () => string): Promise<PostTradeDetailsResponse>;
    /**
     * Check if a trade is feasible based on post-trade details
     */
    isTradeFeasible(params: PostTradeDetailsRequest): Promise<boolean>;
    /**
     * Check if a limit trade is feasible based on post-trade details
     */
    isLimitTradeFeasible(params: PostTradeDetailsLimitRequest): Promise<boolean>;
}
//# sourceMappingURL=post-trade-details.d.ts.map