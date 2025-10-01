# Post Trade Details API

This guide covers how to analyze trade impact before execution using the Polynomial SDK's post-trade details functionality.

## Overview

The post-trade details API provides comprehensive analysis of trade effects before execution, including fees, price impact, health factor, and trade feasibility. This helps traders make informed decisions about their trades.

## Basic Usage

### Get Post-Trade Details for Market Orders

```typescript
import { PolynomialSDK, parseUnits } from "polynomialfi";

const sdk = await PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234567890abcdef...",
  walletAddress: "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7",
});

// Get post-trade details for a market order
const details = await sdk.getPostTradeDetails(
  "market-id", // Market ID
  "5553300111308114473" // Size delta
);

console.log("Trade feasible:", details.feasible);
console.log("Health factor:", details.newHealthFactor);
console.log("Total fees:", details.totalFees);
```

### Get Post-Trade Details for Limit Orders

```typescript
// Get post-trade details for a limit order
const limitDetails = await sdk.getPostTradeDetailsLimit(
  "market-id", // Market ID
  "5553777890581447523", // Size delta
  "220639000000000000000" // Limit price
);

console.log("Limit trade feasible:", limitDetails.feasible);
console.log("Fill price:", limitDetails.fillPrice);
```

## Response Data

The post-trade details response includes comprehensive trade analysis:

```typescript
interface PostTradeDetailsResponse {
  totalFees: string; // Total fees for the trade
  fillPrice: string; // Expected fill price
  newHealthFactor: number; // Health factor after trade
  settlementReward: string; // Settlement reward amount
  ammFees: string; // AMM fees
  nonVipAmmFees: string; // Non-VIP AMM fees
  priceImpact: string; // Price impact of the trade
  newMarginUsage: number; // Margin usage after trade
  feasible: boolean; // Whether the trade is feasible
  isPriceImpactProfitable: boolean; // Whether price impact is profitable
  liquidationPrice: string; // Liquidation price after trade
  errorMsg: string | null; // Error message if any
}
```

## Trade Feasibility

### Check if Trade is Feasible

```typescript
// Check if a market trade is feasible
const isFeasible = await sdk.isTradeFeasible(
  "market-id",
  "5553300111308114473"
);

if (isFeasible) {
  console.log("Trade is feasible - safe to execute");
} else {
  console.log("Trade is not feasible - consider adjusting parameters");
}
```

### Check if Limit Trade is Feasible

```typescript
// Check if a limit trade is feasible
const isLimitFeasible = await sdk.isLimitTradeFeasible(
  "market-id",
  "5553777890581447523",
  "220639000000000000000"
);

if (isLimitFeasible) {
  console.log("Limit trade is feasible");
}
```

## Advanced Usage

### Using the PostTradeDetails Module Directly

```typescript
// Access the post-trade details module directly
const details = await sdk.postTradeDetails.getPostTradeDetails({
  accountId: "your-account-id",
  marketId: "market-id",
  sizeDelta: "5553300111308114473",
});

// For limit orders
const limitDetails = await sdk.postTradeDetails.getPostTradeDetailsLimit({
  accountId: "your-account-id",
  marketId: "market-id",
  sizeDelta: "5553777890581447523",
  limitPrice: "220639000000000000000",
});
```

## Complete Trading Workflow

```typescript
import { PolynomialSDK, parseUnits } from "polynomialfi";

async function analyzeTrade() {
  const sdk = await PolynomialSDK.create({
    apiKey: "your-api-key",
    sessionKey: "0x1234567890abcdef...",
    walletAddress: "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7",
  });

  try {
    // Get market data
    const markets = await sdk.getMarketData();
    const ethMarket = markets.find((m) => m.symbol === "ETH");

    if (!ethMarket) {
      throw new Error("ETH market not found");
    }

    // Analyze potential trade
    const tradeSize = parseUnits("0.1").toString();
    const details = await sdk.getPostTradeDetails(
      ethMarket.marketId,
      tradeSize
    );

    console.log("Trade Analysis:");
    console.log(`- Feasible: ${details.feasible}`);
    console.log(`- Health Factor: ${details.newHealthFactor}`);
    console.log(`- Total Fees: ${details.totalFees}`);
    console.log(`- Price Impact: ${details.priceImpact}`);
    console.log(`- Liquidation Price: ${details.liquidationPrice}`);

    // Only proceed if trade is feasible
    if (details.feasible) {
      console.log("Trade is safe to execute");

      // Create the actual order
      const order = await sdk.createOrder(
        ethMarket.marketId,
        parseUnits("0.1")
      );

      console.log("Order created:", order.id);
    } else {
      console.log("Trade is not feasible - consider adjusting size or price");
    }
  } catch (error) {
    console.error("Trade analysis error:", error.message);
  }
}
```

## Error Handling

```typescript
try {
  const details = await sdk.getPostTradeDetails("market-id", "size");

  if (details.errorMsg) {
    console.error("Trade analysis error:", details.errorMsg);
    return;
  }

  // Process trade details
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

## Best Practices

1. **Always Check Feasibility**: Use `isTradeFeasible()` before executing trades
2. **Monitor Health Factor**: Ensure health factor remains above 1.0
3. **Consider Price Impact**: Large trades may have significant price impact
4. **Check Liquidation Price**: Ensure liquidation price is acceptable
5. **Review Fees**: Consider total fees in your trading strategy

## API Reference

### SDK Methods

- `getPostTradeDetails(marketId, sizeDelta)` - Get post-trade details for market orders
- `getPostTradeDetailsLimit(marketId, sizeDelta, limitPrice)` - Get post-trade details for limit orders
- `isTradeFeasible(marketId, sizeDelta)` - Check if market trade is feasible
- `isLimitTradeFeasible(marketId, sizeDelta, limitPrice)` - Check if limit trade is feasible

### PostTradeDetails Module Methods

- `getPostTradeDetails(params)` - Get post-trade details with full control
- `getPostTradeDetailsLimit(params)` - Get post-trade details for limit orders
- `isTradeFeasible(params)` - Check trade feasibility
- `isLimitTradeFeasible(params)` - Check limit trade feasibility

For more information, see the [Orders API documentation](./orders.md).
