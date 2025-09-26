/**
 * Basic usage example of the Polynomial SDK
 *
 * This example demonstrates:
 * 1. SDK initialization
 * 2. Fetching market data
 * 3. Account management
 * 4. Creating market orders
 * 5. Error handling
 */

import { PolynomialSDK, parseUnits } from "polynomialfi";

// Configuration - replace with your actual values
const API_KEY = process.env.POLYNOMIAL_API_KEY || "<YOUR_API_KEY>";
const SESSION_KEY = process.env.SESSION_KEY || "<YOUR_SESSION_KEY>";
const WALLET_ADDRESS =
  process.env.WALLET_ADDRESS || "0x1234567890123456789012345678901234567890"; // Demo address for testing

async function basicExample() {
  try {
    // 1. Initialize the SDK
    console.log("🚀 Initializing Polynomial SDK...");
    const sdk = PolynomialSDK.create({
      apiKey: API_KEY,
      chainId: 8008, // Polynomial mainnet
      defaultSlippage: 10n, // 10% slippage tolerance
    });

    console.log("✅ SDK initialized successfully");
    console.log("Network config:", sdk.getNetworkConfig());

    // 2. Fetch market data
    console.log("\n📊 Fetching market data...");
    const markets = await sdk.markets.getMarkets();
    console.log(`Found ${markets.length} markets`);

    // Get ETH market specifically
    const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
    if (!ethMarket) {
      throw new Error("ETH market not found");
    }

    console.log("ETH Market:", {
      symbol: ethMarket.symbol,
      price: ethMarket.price,
      marketId: ethMarket.marketId,
      currentOI: ethMarket.currentOI,
      fundingRate: ethMarket.currentFundingRate,
    });

    // 3. Get account information (skip if using demo data)
    if (
      API_KEY !== "<YOUR_API_KEY>" &&
      WALLET_ADDRESS !== "0x1234567890123456789012345678901234567890"
    ) {
      console.log("\n👤 Fetching account information...");
      const accountSummary = await sdk.getAccountSummary(WALLET_ADDRESS);
      console.log("Account Summary:", {
        accountId: accountSummary.account.accountId,
        owner: accountSummary.account.owner,
        totalPositions: accountSummary.totalPositions,
        totalRealizedPnl: accountSummary.totalRealizedPnl,
      });

      // 4. Simulate a trade
      console.log("\n🔮 Simulating trade...");
      const tradeSize = parseUnits("0.001"); // 0.001 ETH
      const simulation = await sdk.markets.simulateTrade({
        accountId: accountSummary.account.accountId,
        marketId: ethMarket.marketId,
        sizeDelta: tradeSize, // Long position
      });

      console.log("Trade Simulation:", {
        fillPrice: simulation.fillPrice,
        totalFees: simulation.totalFees,
        priceImpact: simulation.priceImpact,
        feasible: simulation.feasible,
        liquidationPrice: simulation.liquidationPrice,
      });

      // 5. Create a market order (only if we have real credentials and feasible trade)
      if (simulation.feasible && SESSION_KEY !== "<YOUR_SESSION_KEY>") {
        console.log("\n📝 Creating market order...");
        const orderResult = await sdk.createMarketOrderWithSimulation(
          SESSION_KEY,
          WALLET_ADDRESS,
          "ETH",
          tradeSize,
          true, // Long position
          15n // 15% max slippage
        );

        console.log("Order Result:", orderResult.orderResult);
      } else {
        console.log(
          "\n⚠️  Skipping order creation (demo mode, infeasible trade, or missing session key)"
        );
      }
    } else {
      console.log(
        "\n⚠️  Skipping account operations (demo mode - set POLYNOMIAL_API_KEY and WALLET_ADDRESS env vars for full functionality)"
      );
    }

    console.log("\n✅ Example completed successfully!");
  } catch (error) {
    console.error("❌ Error occurred:", error);

    // Handle different error types
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
}

// Advanced example showing more features
async function advancedExample() {
  try {
    console.log("\n🔥 Advanced Example - Multiple Operations");

    const sdk = PolynomialSDK.create({
      apiKey: API_KEY,
      defaultSlippage: 5n, // 5% slippage
    });

    // Get all available market symbols
    const symbols = await sdk.markets.getAvailableSymbols();
    console.log("Available markets:", symbols);

    // Get account positions (skip if using demo data)
    if (
      API_KEY !== "<YOUR_API_KEY>" &&
      WALLET_ADDRESS !== "0x1234567890123456789012345678901234567890"
    ) {
      const account = await sdk.accounts.getAccount(WALLET_ADDRESS);
      if (account) {
        const positions = await sdk.accounts.getPositions(account.accountId);
        console.log(`Account has ${positions.length} open positions`);

        // Show position details
        positions.forEach((position, index) => {
          console.log(`Position ${index + 1}:`, {
            marketId: position.marketId,
            size: position.size,
            avgEntryPrice: position.avgEntryPrice,
            unrealizedPnl: position.totalRealisedPnlUsd,
          });
        });
      }
    } else {
      console.log("⚠️  Skipping position lookup (demo mode)");
    }

    // Get market statistics for multiple markets
    const marketStats = await Promise.all(
      ["ETH", "BTC", "SOL"].map(async (symbol) => {
        const market = await sdk.markets.getMarketBySymbol(symbol);
        if (market) {
          return await sdk.markets.getMarketStats(market.marketId);
        }
        return null;
      })
    );

    console.log("Market Statistics:", marketStats.filter(Boolean));
  } catch (error) {
    console.error("Advanced example error:", error);
  }
}

// Error handling example
async function errorHandlingExample() {
  console.log("\n🚨 Error Handling Example");

  try {
    // Initialize with invalid API key
    const sdk = PolynomialSDK.create({
      apiKey: "invalid-key",
    });

    await sdk.markets.getMarkets();
  } catch (error) {
    console.log(
      "Caught expected error:",
      error instanceof Error ? error.message : error
    );
  }

  try {
    // Try to get account with invalid address
    const sdk = PolynomialSDK.create({
      apiKey: API_KEY,
    });

    await sdk.accounts.getAccount("invalid-address");
  } catch (error) {
    console.log(
      "Caught validation error:",
      error instanceof Error ? error.message : error
    );
  }
}

// Run examples
async function runExamples() {
  console.log("🎯 Polynomial SDK Examples\n");

  await basicExample();
  await advancedExample();
  await errorHandlingExample();

  console.log("\n🎉 All examples completed!");
}

// Only run if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

export { basicExample, advancedExample, errorHandlingExample };
