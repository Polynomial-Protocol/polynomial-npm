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
  tpsl: any; // Take Profit / Stop Loss structure (nullable or object)
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
  id: string; // Signature
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
 * Limit order payload sent to the orderbook API.
 */
export interface LimitOrderRequest {
  acceptablePrice: string;
  accountId: string;
  allowAggregation: boolean;
  allowPartialMatching: boolean;
  chainId: number;
  expiration: string;
  id: string; // Signature
  marketId: string;
  nonce: string;
  referrerOrRelayer: string;
  settlementStrategyId: string;
  sizeDelta: string;
  trackingCode: string;
  reduceOnly: boolean;
}

/**
 * Payload structure used for signing a limit order.
 */
export interface LimitOrderToSign {
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
 * SDK-Specific Types
 * ============================
 */

/**
 * Order parameters for creating market orders
 */
export interface OrderParams {
  marketId: string;
  size: bigint;
  isLong?: boolean;
  acceptablePrice?: bigint;
  reduceOnly?: boolean;
  slippagePercentage?: bigint;
}

/**
 * Order parameters for creating limit orders
 */
export interface LimitOrderParams {
  marketId: string;
  size: bigint;
  isLong?: boolean;
  acceptablePrice: bigint; // Required for limit orders (limit price)
  reduceOnly?: boolean;
}

/**
 * Market data filters
 */
export interface MarketFilters {
  symbol?: string;
  marketId?: string;
}

/**
 * ============================
 * Margin-Related Interfaces
 * ============================
 */

/**
 * Safe withdrawable collateral amount for a specific synth market
 */
export interface ISafeWithdrawableCollateralAmount {
  synthMarketId: string;
  amount: string;
  allowFullWithdrawal: boolean;
}

/**
 * Complete margin information for an account
 */
export interface IMarginInfo {
  chainId: number;
  accountId: string;
  debt: string;
  availableMargin: string;
  requiredInitialMargin: string;
  requiredMaintenanceMargin: string;
  maxLiquidationReward: string;
  withdrawableMargin: string;
  safeWithdrawableMargin: string;
  safeWithdrawableCollateralAmounts: ISafeWithdrawableCollateralAmount[];
}

/**
 * Simplified margin information returned by getMarginInfo()
 */
export interface IMarginInfoSummary {
  availableMargin: string;
  requiredMaintenanceMargin: string;
}

/**
 * Request payload for getting maximum possible trade sizes
 */
export interface IMaxTradeSizeRequest {
  accountId: string;
  chainId: number;
  marketId: string;
  addedCollaterals: any[]; // Array of additional collaterals (empty for basic request)
}

/**
 * Response for maximum possible trade sizes
 */
export interface IMaxTradeSizeResponse {
  marketId: string;
  maxPossibleTradeSizeForLong: string;
  maxPossibleTradeSizeForShort: string;
}

/**
 * ============================
 * Post Trade Details Interfaces
 * ============================
 */

/**
 * Request payload for post-trade details (market orders)
 */
export interface PostTradeDetailsRequest {
  accountId: string;
  marketId: string;
  sizeDelta: string;
}

/**
 * Request payload for post-trade details (limit orders)
 */
export interface PostTradeDetailsLimitRequest {
  accountId: string;
  marketId: string;
  sizeDelta: string;
  limitPrice: string;
}

/**
 * Response from post-trade details API
 */
export interface PostTradeDetailsResponse {
  totalFees: string;
  fillPrice: string;
  newHealthFactor: number;
  settlementReward: string;
  ammFees: string;
  nonVipAmmFees: string;
  priceImpact: string;
  newMarginUsage: number;
  feasible: boolean;
  isPriceImpactProfitable: boolean;
  liquidationPrice: string;
  errorMsg: string | null;
}
