import { CHAIN_ID } from "./config";
import { get } from "./data";
import { IAccountAPIResponse } from "./type";

/**
 * Fetches account information linked to a given wallet address.
 *
 * @param wallet - Primary wallet address (SuperOwner)
 * @returns Account details matching the current CHAIN_ID, or null if not found
 *
 * Notes:
 * - Assumes the wallet is a SuperOwner (i.e., main account owner).
 * - Filters account data for the current `CHAIN_ID`.
 */
export const getAccount = async (
    wallet: string
): Promise<IAccountAPIResponse | null> => {
    // Call the accounts API with ownership type and chain ID filters
    const response = await get(
        `accounts?owner=${wallet}&ownershipType=SuperOwner&chainIds=${CHAIN_ID}`
    );

    if (response.status === 200) {
        // Parse JSON and find the account matching the current chain
        const data: IAccountAPIResponse[] = await response.json();
        return data.find((item) => item.chainId === CHAIN_ID)!;
    }

    // If the response fails or no match is found, return null
    return null;
};
