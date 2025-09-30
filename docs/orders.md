# Orders API

The Orders module provides order creation and management functionality for Polynomial Perpetuals trading.

## Basic Usage

### Create Simple Order

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

// Create a simple long position
const order = await sdk.createOrder(ethMarket.marketId, parseUnits("0.1"));
console.log("Order created:", order.id);

// Create a short position with custom slippage
const shortOrder = await sdk.createOrder(
  ethMarket.marketId,
  parseUnits("0.1"),
  {
    isLong: false,
    slippagePercentage: 5n,
  }
);
```
