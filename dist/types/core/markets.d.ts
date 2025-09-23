import { HttpClient } from "./http";
import { IMarkets, IPostTradeDetails, MarketFilters, TradeSimulationParams } from "../types";
/**
 * Markets module for handling market data operations
 */
export declare class Markets {
    private readonly httpClient;
    private readonly chainId;
    constructor(httpClient: HttpClient, chainId: number);
    /**
     * Fetches all markets available on the current chain
     */
    getMarkets(filters?: MarketFilters): Promise<IMarkets[]>;
    /**
     * Gets a specific market by symbol
     */
    getMarketBySymbol(symbol: string): Promise<IMarkets | null>;
    /**
     * Gets a specific market by market ID
     */
    getMarketById(marketId: string): Promise<IMarkets | null>;
    /**
     * Simulates the result of a market order before submitting it
     */
    simulateTrade(params: TradeSimulationParams): Promise<IPostTradeDetails>;
    /**
     * Gets market statistics for a specific market
     */
    getMarketStats(marketId: string): Promise<Partial<IMarkets>>;
    /**
     * Gets all available market symbols
     */
    getAvailableSymbols(): Promise<string[]>;
}
//# sourceMappingURL=markets.d.ts.map