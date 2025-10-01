# Orders API

The Orders module provides order creation and management functionality for Polynomial Perpetuals trading, supporting both market orders and limit orders. It also includes post-trade analysis capabilities to help you understand the impact of your trades before execution.

## Market Orders

### Create Simple Market Order

```typescript
// Create a long position (default)
const order = await sdk.createOrder("market-id", parseUnits("0.1"));
console.log("Order created:", order.id);

// Create a short position
const shortOrder = await sdk.createOrder("market-id", parseUnits("0.1"), {
  isLong: false,
});
```

### Create Order with Custom Slippage

```typescript
const order = await sdk.createOrder("market-id", parseUnits("0.1"), {
  isLong: true,
  slippagePercentage: 5n, // 5% slippage
});
```

### Create Reduce-Only Order

```typescript
const closeOrder = await sdk.createOrder("market-id", parseUnits("0.1"), {
  isLong: true,
  reduceOnly: true,
});
```

## Limit Orders

### Create Simple Limit Order

```typescript
// Create a limit order to buy at $2000
const limitOrder = await sdk.createLimitOrder(
  "market-id",
  parseUnits("0.1"),
  parseUnits("2000") // Limit price: $2000
);
```

### Create Limit Order with Options

```typescript
// Create a limit order with specific options
const limitOrder = await sdk.createLimitOrder(
  "market-id",
  parseUnits("0.1"),
  parseUnits("2000"),
  {
    isLong: false, // Short position
    reduceOnly: true, // Only reduce existing position
  }
);
```

### Create Long Limit Order

```typescript
// Create a limit order for a long position
const longLimitOrder = await sdk.createLimitLongOrder(
  "market-id",
  parseUnits("0.1"),
  parseUnits("2000") // Buy at $2000 or better
);
```

### Create Short Limit Order

```typescript
// Create a limit order for a short position
const shortLimitOrder = await sdk.createLimitShortOrder(
  "market-id",
  parseUnits("0.1"),
  parseUnits("2000"), // Sell at $2000 or better
  false // reduceOnly: false
);
```

## Advanced Order Creation

### Create Market Order with Parameters

```typescript
const order = await sdk.orders.createMarketOrder({
  marketId: "market-id",
  size: parseUnits("0.1"),
  isLong: true,
  acceptablePrice: parseUnits("2000"), // $2000 per unit
  reduceOnly: false,
});
```

### Create Limit Order with Parameters

```typescript
const limitOrder = await sdk.orders.createLimitOrder({
  marketId: "market-id",
  size: parseUnits("0.1"),
  acceptablePrice: parseUnits("2000"), // Required for limit orders
  isLong: true,
  reduceOnly: false,
});
```

### Create Long Order

```typescript
const longOrder = await sdk.orders.createLongOrder(
  "market-id",
  parseUnits("0.1")
);
```

### Create Short Order

```typescript
const shortOrder = await sdk.orders.createShortOrder(
  "market-id",
  parseUnits("0.1")
);
```

## Complete Example

```typescript
import { PolynomialSDK, parseUnits } from "polynomialfi";

const sdk = await PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234...",
  walletAddress: "0x742d35...",
});

// Get market data
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");

// Create a market order (executes immediately)
const marketOrder = await sdk.createOrder(
  ethMarket.marketId,
  parseUnits("0.1")
);
console.log("Market order created:", marketOrder.id);

// Create a limit order (waits for price)
const limitOrder = await sdk.createLimitOrder(
  ethMarket.marketId,
  parseUnits("0.1"),
  parseUnits("2000") // Buy at $2000 or better
);
console.log("Limit order created:", limitOrder.id);

// Create a short position with custom slippage
const shortOrder = await sdk.createOrder(
  ethMarket.marketId,
  parseUnits("0.1"),
  {
    isLong: false,
    slippagePercentage: 5n,
  }
);

// Create a limit short order
const limitShortOrder = await sdk.createLimitShortOrder(
  ethMarket.marketId,
  parseUnits("0.1"),
  parseUnits("2500") // Sell at $2500 or better
);
```

## Post-Trade Analysis

### Analyze Trade Impact Before Execution

```typescript
// Get post-trade details for a market order
const tradeDetails = await sdk.getPostTradeDetails(
  ethMarket.marketId,
  parseUnits("0.1").toString()
);

console.log("Trade Analysis:");
console.log(`- Feasible: ${tradeDetails.feasible}`);
console.log(`- Health Factor: ${tradeDetails.newHealthFactor}`);
console.log(`- Total Fees: ${tradeDetails.totalFees}`);
console.log(`- Price Impact: ${tradeDetails.priceImpact}`);

// Check if trade is feasible before executing
if (tradeDetails.feasible) {
  const order = await sdk.createOrder(ethMarket.marketId, parseUnits("0.1"));
  console.log("Order created:", order.id);
} else {
  console.log("Trade not feasible - consider adjusting parameters");
}
```

### Analyze Limit Order Impact

```typescript
// Get post-trade details for a limit order
const limitDetails = await sdk.getPostTradeDetailsLimit(
  ethMarket.marketId,
  parseUnits("0.1").toString(),
  parseUnits("2000").toString() // Limit price
);

console.log("Limit Order Analysis:");
console.log(`- Feasible: ${limitDetails.feasible}`);
console.log(`- Fill Price: ${limitDetails.fillPrice}`);
console.log(`- Liquidation Price: ${limitDetails.liquidationPrice}`);
```

### Quick Feasibility Check

```typescript
// Quick check if trade is feasible
const isFeasible = await sdk.isTradeFeasible(
  ethMarket.marketId,
  parseUnits("0.1").toString()
);

if (isFeasible) {
  console.log("Trade is safe to execute");
} else {
  console.log("Trade may not be feasible");
}
```
