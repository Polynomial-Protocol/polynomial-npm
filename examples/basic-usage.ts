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
const API_KEY = "q7k9z2m1v4r8x0b5n6c3s1h9t2y4w8a1"; // Your Polynomial API key
const SESSION_KEY =
  "0xaed8638a12731fc71302f7256df5adce68e0a9784ae11dd628b7453d762f62fb"; // Your session key for signing orders
const WALLET_ADDRESS = "0x3d6C731daCFD0d259fadC5124a7C14f4F544F2DC"; // Your wallet address

async function runExample(): Promise<void> {
  // Validate required configuration values
  if (!API_KEY) {
    throw new Error(
      "API_KEY is required - please update the API_KEY variable with your actual API key"
    );
  }
  if (!SESSION_KEY) {
    throw new Error(
      "SESSION_KEY is required - please update the SESSION_KEY variable with your actual session key"
    );
  }
  if (!WALLET_ADDRESS) {
    throw new Error(
      "WALLET_ADDRESS is required - please update the WALLET_ADDRESS variable with your actual wallet address"
    );
  }

  try {
    // Initialize the SDK with all required credentials
    console.log("🚀 Initializing Polynomial SDK...");
    const sdk = await PolynomialSDK.create({
      apiKey: API_KEY,
      sessionKey: SESSION_KEY,
      walletAddress: WALLET_ADDRESS,
      chainId: 8008,
    });

    // Step 1: List all markets
    const markets = await sdk.markets.getMarkets();
    console.log(`📊 Found ${markets.length} markets`);

    // Debug: Show available markets
    console.log("Available markets:");
    markets.forEach((market) => {
      console.log(
        `- ${market.symbol}: ID=${market.marketId}, Price=$${market.price}`
      );
    });

    // Step 2: Get ETH market details (with fallback)
    let selectedMarket = await sdk.markets.getMarketBySymbol("ETH");

    if (!selectedMarket && markets.length > 0) {
      // Fallback to first available market if ETH not found
      const firstMarket = markets[0];
      if (firstMarket) {
        selectedMarket = firstMarket;
        console.log(
          `⚠️  ETH market not found, using ${selectedMarket.symbol} instead`
        );
      }
    }

    if (!selectedMarket) {
      throw new Error("No markets available");
    }

    console.log(
      `💰 Selected Market - ${selectedMarket.symbol}: ID=${selectedMarket.marketId}, Price=$${selectedMarket.price}`
    );

    // Step 3: Get account summary using stored credentials (no parameters needed)
    const accountSummary = await sdk.accounts.getMyAccountSummary();
    console.log("Account fetched", accountSummary);

    // Step 4: Create a simple market order using stored credentials
    console.log(
      `📝 Creating market order for 0.001 ${selectedMarket.symbol}...`
    );
    const tradeSize = parseUnits("0.001"); // 0.001 of selected asset

    // Option 1: Use the simple createOrder method (recommended)
    const orderResult = await sdk.createOrder(
      selectedMarket.marketId,
      tradeSize,
      {
        isLong: true, // Long position
        slippagePercentage: 10n, // 10% slippage
      }
    );

    // Option 2: Use the direct orders module method if you need more control
    // const orderResult = await sdk.orders.createLongOrder(
    //   selectedMarket.marketId,
    //   tradeSize,
    //   acceptablePrice
    // );

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
