/**
 * =========================
 * Market-Related Interfaces
 * =========================
 */
/**
 * Response shape from the /markets endpoint for a given chain.
 */
export interface IMarketDataReceived {
    chainId: number;
    markets: IMarkets[];
}
/**
 * Represents the structure of a single market entry (e.g., ETH, BONK, BTC).
 */
export interface IMarkets {
    marketId: string;
    symbol: string;
    skew: string;
    price: number;
    currentOI: string;
    currentFundingRate: string;
    currentFundingVelocity: string;
    makerFeeRatio: string;
    takerFeeRatio: string;
    skewScale: string;
    maxMarketSize: string;
    maxMarketValue: string;
    tradesCount24h: number;
    tradesVolume24h: number;
    price24HrAgo: number;
    markPrice: string;
    longOI: string;
    shortOI: string;
    currentSkew: string;
    positiveSkew: string;
    negativeSkew: string;
    availableLiquidityLong: string;
    availableLiquidityShort: string;
    currentFundingRate1HInPercentage: string;
    currentFundingRate8HInPercentage: string;
    currentFundingRate1YInPercentage: string;
    currentInterestRate1HInPercentage: string;
    currentInterestRate8HInPercentage: string;
    currentInterestRate1YInPercentage: string;
    netLongFundingRate1HInPercentage: string;
    netLongFundingRate8HInPercentage: string;
    netLongFundingRate1YInPercentage: string;
    netShortFundingRate1HInPercentage: string;
    netShortFundingRate8HInPercentage: string;
    netShortFundingRate1YInPercentage: string;
}
/**
 * ==========================
 * Position-Related Interfaces
 * ==========================
 */
/**
 * Response from /positions/v2 API.
 */
export interface IPositionDataReceived {
    chainId: number;
    positions: IPosition[];
    totalCount: number;
}
/**
 * Represents an individual trading position on the platform.
 */
export interface IPosition {
    orderType: string;
    accountId: string;
    chainId: number;
    marketId: string;
    size: string;
    totalRealisedFundingUsd: string;
    totalRealisedPnlUsd: string;
    unrealisedFundingUsd: string;
    totalVolumeUsd: string;
    avgEntryPrice: string;
    latestInteractionPrice: string;
    liquidationPrice: string;
    entryTimestamp: number;
    breakEvenPriceIncludingClosingFee: string;
    breakEvenPriceExcludingClosingFee: string;
    totalRealisedInterestUsd: string;
    unrealisedInterestUsd: string;
    tpsl: any;
}
/**
 * =========================
 * Order Submission Interfaces
 * =========================
 */
/**
 * Market order payload sent to the orderbook API.
 */
export interface MarketOrderRequest {
    acceptablePrice: string;
    accountId: string;
    allowAggregation: boolean;
    allowPartialMatching: boolean;
    chainId: number;
    expiration: string;
    id: string;
    marketId: string;
    nonce: string;
    referrerOrRelayer: string;
    settlementStrategyId: string;
    sizeDelta: string;
    trackingCode: string;
    reduceOnly: boolean;
}
/**
 * Payload structure used for signing a market order.
 */
export interface MarketOrderToSign {
    marketId: string;
    accountId: string;
    sizeDelta: string;
    settlementStrategyId: string;
    referrerOrRelayer: string;
    allowAggregation: boolean;
    allowPartialMatching: boolean;
    acceptablePrice: string;
    trackingCode: string;
    expiration: string;
    nonce: string;
    chainId: number;
    eoa: string;
    reduceOnly: boolean;
}
/**
 * ==========================
 * Account-Related Interfaces
 * ==========================
 */
/**
 * Response object for a trading account.
 */
export interface IAccountAPIResponse {
    owner: string;
    superOwner: string;
    accountId: string;
    chainId: number;
}
/**
 * ============================
 * Post-Order Simulation Output
 * ============================
 */
/**
 * Response from `post-trade-details` API.
 * Provides simulated values before order execution.
 */
export interface IPostTradeDetails {
    totalFees: string;
    fillPrice: string;
    priceImpact: string;
    newMarginUsage: number;
    newHealthFactor: number;
    feasible: boolean;
    settlementReward: string;
    liquidationPrice: string | null;
    errorMsg: string | null;
}
/**
 * ============================
 * SDK-Specific Types
 * ============================
 */
/**
 * Order parameters for creating market orders
 */
export interface OrderParams {
    marketId: string;
    size: bigint;
    isLong: boolean;
    acceptablePrice?: bigint;
    reduceOnly?: boolean;
}
/**
 * Trade simulation parameters
 */
export interface TradeSimulationParams {
    accountId: string;
    marketId: string;
    sizeDelta: bigint;
}
/**
 * Market data filters
 */
export interface MarketFilters {
    symbol?: string;
    marketId?: string;
}
//# sourceMappingURL=index.d.ts.map