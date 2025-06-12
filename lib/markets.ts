import { CHAIN_ID } from "./config";
import { get, post } from "./data";
import { IMarketDataReceived, IMarkets, IPostTradeDetails } from "./type";

/**
 * Fetches all markets available on the current chain.
 *
 * @returns Array of market configurations (e.g., ETH, BTC), or null if not found
 *
 * Notes:
 * - Filters market data by `CHAIN_ID` to ensure chain-specific compatibility.
 * - Expects `markets` field in response to contain trading pairs.
 */
export const getMarkets = async (): Promise<IMarkets[] | null> => {
    const response = await get(`markets`);

    if (response.status === 200) {
        const data: IMarketDataReceived[] = await response.json();
        return data.find((item) => item.chainId === CHAIN_ID)?.markets ?? null;
    } else {
        console.error('Failed to fetch markets:', response.statusText);
        return null;
    }
};

/**
 * Simulates the result of a market order before submitting it.
 * Returns post-trade metrics like fill price, margin usage, liquidation price, etc.
 *
 * @param accountId - ID of the trading account
 * @param chainId - Target chain ID as a string
 * @param marketId - Unique ID of the selected market
 * @param sizeDelta - Position size (in base units, as bigint)
 * @returns Post-trade detail simulation result
 *
 * Notes:
 * - Useful to show users potential outcomes before signing a market order.
 */
export const fetchPostMarketDetails = async (
    accountId: string,
    chainId: string,
    marketId: string,
    sizeDelta: bigint
): Promise<IPostTradeDetails> => {
    const response = await post(`post-trade-details?chainId=${chainId}`, {
        accountId,
        marketId,
        sizeDelta: sizeDelta.toString(), // convert bigint to string for JSON compatibility
    });

    const data: IPostTradeDetails = await response.json();
    return data;
};
