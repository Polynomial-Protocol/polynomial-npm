import {
    DEFAULT_SLIPPAGE_PERCENTAGE,
} from "./config";
import { placeOrderbookMarketOrder, } from "./nitromode";





/**
 * Calculates acceptable price based on slippage.
 * 
 * @param isLong - Direction of the trade
 * @param marketPrice - Current market price (in base units)
 * @returns Price adjusted for slippage
 */
const calculateAcceptablePrice = (
    isLong: boolean,
    marketPrice: bigint
): bigint => {
    const slippageMultiplier = isLong
        ? 1n + DEFAULT_SLIPPAGE_PERCENTAGE / 100n
        : 1n - DEFAULT_SLIPPAGE_PERCENTAGE / 100n;

    return marketPrice * slippageMultiplier;
};



/**
 * High-level helper to create a Nitro mode market order.
 * Internally builds and submits a signed order using slippage-based price protection.
 * 
 * @param sessionKey - Session key for signing
 * @param marketId - Target market ID
 * @param tradeSize - Size of the order
 * @param isLong - Trade direction
 * @param marketPrice - Market fill price from simulation
 * @param walletAddress - EOA of the user
 * @param accountId - Linked account ID
 * @returns Order submission result
 */
export const createMarketOrder = async (
    sessionKey: string,
    marketId: string,
    tradeSize: bigint,
    isLong: boolean,
    marketPrice: bigint,
    walletAddress: string,
    accountId: string
): Promise<any> => {

    const acceptablePrice = calculateAcceptablePrice(isLong, marketPrice);

    return await placeOrderbookMarketOrder(
        marketId,
        tradeSize,
        isLong,
        acceptablePrice,
        false,
        walletAddress,
        accountId,
        sessionKey
    );
};
