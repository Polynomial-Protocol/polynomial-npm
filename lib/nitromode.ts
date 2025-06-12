import { API_ORDERBOOK_ENDPOINT, CHAIN_ID, PERP_FUTURES, RELAYER_ADDRESS, ZERO_HEX_32 } from "./config";
import { MarketOrderRequest, MarketOrderToSign } from "./type";
import { privateKeyToAccount } from 'viem/accounts';
import { getWeekFromNowTimestamp } from "./utils";

/**
 * Signs a Nitro Mode market order using EIP-712 typed data.
 * 
 * @param sessionKey - Private key of the API wallet (used for signing)
 * @param order - Market order payload to be signed
 * @returns Signature string compatible with orderbook submission
 * 
 * Notes:
 * - Uses EIP-712 structured data for off-chain order signing.
 * - The signed result is later passed to the `submitMarketOrder` API.
 */
export async function signMarketOrder(
    sessionKey: string,
    order: MarketOrderToSign
): Promise<string> {
    const {
        marketId,
        accountId,
        sizeDelta,
        settlementStrategyId,
        referrerOrRelayer,
        allowAggregation,
        allowPartialMatching,
        acceptablePrice,
        expiration,
        nonce,
        chainId,
        eoa,
        reduceOnly
    } = order;

    // Domain setup as per EIP-712 for the PERP_FUTURES contract
    const domain = {
        name: PERP_FUTURES.name,
        version: PERP_FUTURES.version,
        chainId,
        verifyingContract: PERP_FUTURES.address as `0x${string}`
    };

    // Typed structure for the OffchainOrder object
    const types = {
        OffchainOrder: [
            { name: 'marketId', type: 'uint128' },
            { name: 'accountId', type: 'uint128' },
            { name: 'sizeDelta', type: 'int128' },
            { name: 'settlementStrategyId', type: 'uint128' },
            { name: 'referrerOrRelayer', type: 'address' },
            { name: 'allowAggregation', type: 'bool' },
            { name: 'allowPartialMatching', type: 'bool' },
            { name: 'reduceOnly', type: 'bool' },
            { name: 'acceptablePrice', type: 'uint256' },
            { name: 'trackingCode', type: 'bytes32' },
            { name: 'expiration', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
        ]
    };

    // Final message to sign
    const message = {
        marketId,
        accountId,
        sizeDelta,
        settlementStrategyId,
        referrerOrRelayer,
        allowAggregation,
        allowPartialMatching,
        reduceOnly,
        acceptablePrice,
        trackingCode: ZERO_HEX_32, // Default tracking code
        expiration,
        nonce
    };

    // Convert session key into a signer account
    const account = privateKeyToAccount(sessionKey as `0x${string}`);

    // Return the EIP-712-compliant signature
    return account.signTypedData({
        domain,
        types,
        primaryType: 'OffchainOrder',
        message
    });
}


/**
 * Submits a signed market order to the orderbook endpoint.
 * 
 * @param marketId - ID of the market to trade
 * @param data - Signed market order payload
 * @returns API response or throws an error with API message
 */
export const submitMarketOrder = async (
    marketId: string,
    data: MarketOrderRequest
): Promise<any> => {
    const response = await fetch(`${API_ORDERBOOK_ENDPOINT}/market_order/${marketId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData.message));
    }

    return await response.json();
};


/**
 * Constructs, signs, and submits a Nitro mode market order.
 * 
 * @param marketId - ID of the market
 * @param size - Trade size (in base units)
 * @param isLong - Trade direction (true = long, false = short)
 * @param acceptablePrice - Max/min price accepted after slippage
 * @param reduceOnly - Optional; whether this order only reduces open position
 * @param wallet - EOA of the trader
 * @param accountId - Account ID linked to the API wallet
 * @param sessionKey - API session key for signing the order
 * @returns Result of order submission
 */
export const placeOrderbookMarketOrder = async (
    marketId: string,
    size: bigint,
    isLong: boolean,
    acceptablePrice: bigint,
    reduceOnly: boolean = false,
    wallet: string,
    accountId: string,
    sessionKey: string
): Promise<any> => {
    const order = {
        marketId,
        accountId,
        sizeDelta: isLong ? size.toString() : `-${size.toString()}`,
        settlementStrategyId: '0',
        referrerOrRelayer: RELAYER_ADDRESS,
        allowAggregation: true,
        allowPartialMatching: true,
        acceptablePrice: acceptablePrice.toString(),
        trackingCode: ZERO_HEX_32,
        expiration: getWeekFromNowTimestamp().toFixed(),
        nonce: Date.now().toString(),
        chainId: CHAIN_ID,
        eoa: wallet,
        reduceOnly
    };

    // Sign order using API wallet's session key
    const signature = await signMarketOrder(sessionKey, order);

    // Submit the signed order
    return await submitMarketOrder(marketId, {
        ...order,
        id: signature
    });
};

