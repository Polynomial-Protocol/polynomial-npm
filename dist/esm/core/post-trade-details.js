import { OrderError } from "../errors";
/**
 * Post Trade Details module for analyzing trade impact before execution
 */
export class PostTradeDetails {
    constructor(httpClient, chainId) {
        this.httpClient = httpClient;
        this.chainId = chainId;
    }
    /**
     * Get post-trade details for a market order
     */
    async getPostTradeDetails(params) {
        try {
            const response = await this.httpClient.post(`post-trade-details?chainId=${this.chainId}`, params);
            return response;
        }
        catch (error) {
            throw new OrderError(`Failed to get post-trade details: ${error instanceof Error ? error.message : "Unknown error"}`, { params });
        }
    }
    /**
     * Get post-trade details for a limit order
     */
    async getPostTradeDetailsLimit(params) {
        try {
            const response = await this.httpClient.post(`post-trade-details?chainId=${this.chainId}`, params);
            return response;
        }
        catch (error) {
            throw new OrderError(`Failed to get post-trade details for limit order: ${error instanceof Error ? error.message : "Unknown error"}`, { params });
        }
    }
    /**
     * Get post-trade details with account ID from stored credentials
     */
    async getPostTradeDetailsForAccount(marketId, sizeDelta, getAccountId) {
        const accountId = getAccountId();
        return this.getPostTradeDetails({
            accountId,
            marketId,
            sizeDelta,
        });
    }
    /**
     * Get post-trade details for limit order with account ID from stored credentials
     */
    async getPostTradeDetailsLimitForAccount(marketId, sizeDelta, limitPrice, getAccountId) {
        const accountId = getAccountId();
        return this.getPostTradeDetailsLimit({
            accountId,
            marketId,
            sizeDelta,
            limitPrice,
        });
    }
    /**
     * Check if a trade is feasible based on post-trade details
     */
    async isTradeFeasible(params) {
        try {
            const details = await this.getPostTradeDetails(params);
            return details.feasible;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Check if a limit trade is feasible based on post-trade details
     */
    async isLimitTradeFeasible(params) {
        try {
            const details = await this.getPostTradeDetailsLimit(params);
            return details.feasible;
        }
        catch (error) {
            return false;
        }
    }
}
//# sourceMappingURL=post-trade-details.js.map