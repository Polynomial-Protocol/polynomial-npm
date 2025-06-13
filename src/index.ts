import { getAccount } from '../lib/account';
import { CHAIN_ID } from '../lib/config';
import { fetchPostMarketDetails, getMarkets } from '../lib/markets';
import { createMarketOrder } from '../lib/order';

/**
 * Replace the following placeholders with actual values:
 * - SESSION_KEY: Session key linked to your API wallet (used for signing)
 * - WALLET_ADDRESS: Your primary trading wallet address
 */
const SESSION_KEY = '<SESSION_KEY>';
const WALLET_ADDRESS = '<PRIMARY_WALLET_ADDRESS>';
const X_API_KEY = '<X_API_KEY>'; // Raise a discord ticket to get your X-API-Key

getMarkets().then(async (markets) => {
    if (!markets) {
        console.error('Failed to fetch market data.');
        return;
    }

    /**
     * For demonstration, we are selecting the ETH market.
     * Replace this with the desired market symbol or ID for your use case.
     */
    const ethMarket = markets.find((item) => item.symbol === 'ETH');
    if (!ethMarket) {
        console.error('ETH market not found.');
        return;
    }

    console.log('ETH Market Data:', ethMarket);

    // Optional delay to simulate real-time processing or avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));

    /**
     * Fetch trading account details using the primary wallet address.
     * This account will be used to calculate margins and link orders.
     */
    const account = await getAccount(WALLET_ADDRESS, X_API_KEY);
    if (!account) {
        console.error('Account not found for the given wallet address.');
        return;
    }

    console.log('Account Data:', account);

    /**
     * Define market order parameters.
     * Here, we place a LONG position with a size of 0.00003 ETH (in base units).
     * Adjust the size and direction as per your integration needs.
     */
    const position = {
        size: 3n * 10n ** 14n, // Equivalent to 0.00003 ETH
        isLong: true,          // true = long position, false = short position
    };

    /**
     * Fetch post-order details before submitting the market order.
     * This simulates the expected result, including:
     * - fill price
     * - liquidation price (post-order)
     * - AMM fees
     * - margin impact
     */
    const postDetails = await fetchPostMarketDetails(
        account.accountId,
        CHAIN_ID.toString(),
        ethMarket.marketId,
        position.size,
        X_API_KEY
    );

    console.log('Post Market Details:', postDetails);

    /**
     * Submit a market order using Nitro Mode API.
     * Requires the session key, market ID, order size, position direction, and estimated fill price.
     * The order will be signed using the API wallet associated with the session key.
     */
    const orderStatus = await createMarketOrder(
        SESSION_KEY,
        ethMarket.marketId,
        position.size,
        position.isLong,
        BigInt(postDetails.fillPrice),
        WALLET_ADDRESS,
        account.accountId,
        X_API_KEY
    );

    console.log('Market Order Status:', orderStatus);
});
