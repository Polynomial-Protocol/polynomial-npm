/**
 * Polynomial SDK Example - Real Market Trading
 *
 * This example demonstrates:
 * 1. List all markets
 * 2. Get ETH market details
 * 3. Create a real market order for ETH
 */

import { PolynomialSDK, parseUnits } from "polynomialfi";

// Required configuration - update these values with your actual credentials
const API_KEY = ""; // Your Polynomial API key
const SESSION_KEY = ""; // Your session key for signing orders
const WALLET_ADDRESS = ""; // Your wallet address

async function runExample(): Promise<void> {
  // Validate required configuration values
  if (!API_KEY) {
    throw new Error("API_KEY is required - please update the API_KEY variable with your actual API key");
  }
  if (!SESSION_KEY) {
    throw new Error("SESSION_KEY is required - please update the SESSION_KEY variable with your actual session key");
  }
  if (!WALLET_ADDRESS) {
    throw new Error("WALLET_ADDRESS is required - please update the WALLET_ADDRESS variable with your actual wallet address");
  }

  try {
    // Initialize the SDK
    console.log("🚀 Initializing Polynomial SDK...");
    const sdk = PolynomialSDK.create({
      apiKey: API_KEY,
      chainId: 8008,
    });

    // Step 1: List all markets
    const markets = await sdk.markets.getMarkets();
    console.log(`📊 Found ${markets.length} markets`);

    // Step 2: Get ETH market details
    const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
    if (!ethMarket) {
      throw new Error("ETH market not found");
    }
    console.log(`💰 ETH Price: $${ethMarket.price}`);

    // Step 3: Create a real market order for ETH
    console.log("📝 Creating market order for 0.001 ETH...");

    const accountSummary = await sdk.getAccountSummary(WALLET_ADDRESS);
    const tradeSize = parseUnits("0.001"); // 0.001 ETH
    const acceptablePrice = BigInt(Math.floor(ethMarket.price * 1.1 * 1e18)); // 10% slippage

    const orderResult = await sdk.orders.createLongOrder(
      SESSION_KEY,
      WALLET_ADDRESS,
      accountSummary.account.accountId,
      ethMarket.marketId,
      tradeSize,
      acceptablePrice
    );

    console.log("✅ Order created successfully!");
    console.log("Order ID:", orderResult.id || orderResult.orderId || "N/A");
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runExample().catch(console.error);
}

export { runExample };
