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
export const getMarkets = async (
  x_api_key: string
): Promise<IMarkets[] | null> => {
  const response = await get(`markets`, x_api_key);

  if (response.status === 200) {
    const data: IMarketDataReceived[] = await response.json();
    return data.find((item) => item.chainId === CHAIN_ID)?.markets ?? null;
  } else {
    console.error("Failed to fetch markets:", response.statusText);
    return null;
  }
};
