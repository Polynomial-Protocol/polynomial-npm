import { MarketError } from "../errors";
/**
 * Markets module for handling market data operations
 */
export class Markets {
    constructor(httpClient, chainId) {
        this.httpClient = httpClient;
        this.chainId = chainId;
    }
    /**
     * Fetches all markets available on the current chain
     */
    async getMarkets(filters) {
        try {
            const response = await this.httpClient.get("markets");
            const chainData = response.find((item) => item.chainId === this.chainId);
            if (!chainData) {
                throw new MarketError(`No market data found for chain ID ${this.chainId}`, { chainId: this.chainId });
            }
            let markets = chainData.markets;
            // Apply filters if provided
            if (filters) {
                if (filters.symbol) {
                    markets = markets.filter((market) => market.symbol.toLowerCase() === filters.symbol.toLowerCase());
                }
                if (filters.marketId) {
                    markets = markets.filter((market) => market.marketId === filters.marketId);
                }
            }
            return markets;
        }
        catch (error) {
            if (error instanceof MarketError) {
                throw error;
            }
            throw new MarketError(`Failed to fetch markets: ${error instanceof Error ? error.message : "Unknown error"}`, { chainId: this.chainId, filters });
        }
    }
    /**
     * Gets a specific market by symbol
     */
    async getMarketBySymbol(symbol) {
        try {
            const markets = await this.getMarkets({ symbol });
            return markets.length > 0 ? markets[0] : null;
        }
        catch (error) {
            throw new MarketError(`Failed to fetch market for symbol ${symbol}: ${error instanceof Error ? error.message : "Unknown error"}`, { symbol, chainId: this.chainId });
        }
    }
    /**
     * Gets a specific market by market ID
     */
    async getMarketById(marketId) {
        try {
            const markets = await this.getMarkets({ marketId });
            return markets.length > 0 ? markets[0] : null;
        }
        catch (error) {
            throw new MarketError(`Failed to fetch market for ID ${marketId}: ${error instanceof Error ? error.message : "Unknown error"}`, { marketId, chainId: this.chainId });
        }
    }
    /**
     * Simulates the result of a market order before submitting it
     */
    async simulateTrade(params) {
        const { accountId, marketId, sizeDelta } = params;
        try {
            const response = await this.httpClient.post(`post-trade-details?chainId=${this.chainId}`, {
                accountId,
                marketId,
                sizeDelta: sizeDelta.toString(),
            });
            return response;
        }
        catch (error) {
            throw new MarketError(`Failed to simulate trade: ${error instanceof Error ? error.message : "Unknown error"}`, {
                accountId,
                marketId,
                sizeDelta: sizeDelta.toString(),
                chainId: this.chainId,
            });
        }
    }
    /**
     * Gets market statistics for a specific market
     */
    async getMarketStats(marketId) {
        try {
            const market = await this.getMarketById(marketId);
            if (!market) {
                throw new MarketError(`Market not found: ${marketId}`, { marketId });
            }
            // Return key statistics
            return {
                marketId: market.marketId,
                symbol: market.symbol,
                price: market.price,
                markPrice: market.markPrice,
                currentOI: market.currentOI,
                currentFundingRate: market.currentFundingRate,
                tradesCount24h: market.tradesCount24h,
                tradesVolume24h: market.tradesVolume24h,
                price24HrAgo: market.price24HrAgo,
                availableLiquidityLong: market.availableLiquidityLong,
                availableLiquidityShort: market.availableLiquidityShort,
            };
        }
        catch (error) {
            if (error instanceof MarketError) {
                throw error;
            }
            throw new MarketError(`Failed to fetch market stats: ${error instanceof Error ? error.message : "Unknown error"}`, { marketId });
        }
    }
    /**
     * Gets all available market symbols
     */
    async getAvailableSymbols() {
        try {
            const markets = await this.getMarkets();
            return markets.map((market) => market.symbol);
        }
        catch (error) {
            throw new MarketError(`Failed to fetch available symbols: ${error instanceof Error ? error.message : "Unknown error"}`, { chainId: this.chainId });
        }
    }
}
//# sourceMappingURL=markets.js.map