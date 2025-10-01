# Limit Orders

This guide covers how to create and manage limit orders using the Polynomial SDK.

## Overview

Limit orders allow you to specify the exact price at which you want to buy or sell an asset. Unlike market orders that execute immediately at the current market price, limit orders are placed on the orderbook and will only execute when the market price reaches your specified limit price.

## Creating Limit Orders

### Basic Limit Order

```typescript
import { PolynomialSDK, parseUnits } from "polynomialfi";

const sdk = await PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234567890abcdef...",
  walletAddress: "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7",
});

// Create a limit order to buy 0.1 ETH at $2000
const limitOrder = await sdk.createLimitOrder(
  "market-id", // Market ID for ETH
  parseUnits("0.1"), // Size: 0.1 ETH
  parseUnits("2000") // Limit price: $2000
);
```

### Limit Order with Options

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

### Long Position Limit Order

```typescript
// Create a limit order for a long position
const longLimitOrder = await sdk.createLimitLongOrder(
  "market-id",
  parseUnits("0.1"),
  parseUnits("2000") // Buy at $2000 or better
);
```

### Short Position Limit Order

```typescript
// Create a limit order for a short position
const shortLimitOrder = await sdk.createLimitShortOrder(
  "market-id",
  parseUnits("0.1"),
  parseUnits("2000"), // Sell at $2000 or better
  false // reduceOnly: false
);
```

## Advanced Usage

### Using the Orders Module Directly

```typescript
// Access the orders module directly for more control
const limitOrder = await sdk.orders.createLimitOrder({
  marketId: "market-id",
  size: parseUnits("0.1"),
  acceptablePrice: parseUnits("2000"),
  isLong: true,
  reduceOnly: false,
});
```

### Limit Order Parameters

| Parameter         | Type      | Required | Description                                      |
| ----------------- | --------- | -------- | ------------------------------------------------ |
| `marketId`        | `string`  | ✅       | The market ID for the asset                      |
| `size`            | `bigint`  | ✅       | The size of the order (in base units)            |
| `acceptablePrice` | `bigint`  | ✅       | The limit price (in base units)                  |
| `isLong`          | `boolean` | ❌       | Position direction (default: `true`)             |
| `reduceOnly`      | `boolean` | ❌       | Only reduce existing position (default: `false`) |

## Price Format

All prices and sizes should be provided as `bigint` values in the smallest unit (wei for ETH, etc.). Use the `parseUnits` utility function to convert from human-readable values:

```typescript
import { parseUnits } from "polynomialfi";

// Convert 0.1 ETH to wei
const size = parseUnits("0.1"); // 100000000000000000n

// Convert $2000 to wei (assuming 18 decimals)
const price = parseUnits("2000"); // 2000000000000000000000n
```

## Error Handling

```typescript
try {
  const limitOrder = await sdk.createLimitOrder(
    "market-id",
    parseUnits("0.1"),
    parseUnits("2000")
  );
  console.log("Limit order created:", limitOrder.id);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
  } else if (error instanceof OrderError) {
    console.error("Order error:", error.message);
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

## Best Practices

1. **Price Validation**: Always validate that your limit price is reasonable compared to the current market price
2. **Size Limits**: Check maximum trade sizes before placing orders
3. **Error Handling**: Implement proper error handling for network issues and validation errors
4. **Order Management**: Keep track of your order IDs for monitoring and cancellation

## Example: Complete Trading Workflow

```typescript
import { PolynomialSDK, parseUnits } from "polynomialfi";

async function tradingExample() {
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

    // Get current price
    const currentPrice = parseUnits(ethMarket.price.toString());
    const limitPrice = (currentPrice * 95n) / 100n; // 5% below current price

    // Create a limit buy order
    const limitOrder = await sdk.createLimitOrder(
      ethMarket.marketId,
      parseUnits("0.1"), // 0.1 ETH
      limitPrice // 5% below current price
    );

    console.log("Limit order placed:", {
      orderId: limitOrder.id,
      market: ethMarket.symbol,
      size: "0.1 ETH",
      limitPrice: limitPrice.toString(),
    });
  } catch (error) {
    console.error("Trading error:", error.message);
  }
}
```

## API Reference

### SDK Methods

- `createLimitOrder(marketId, size, acceptablePrice, options?)` - Create a limit order
- `createLimitLongOrder(marketId, size, acceptablePrice, reduceOnly?)` - Create a long limit order
- `createLimitShortOrder(marketId, size, acceptablePrice, reduceOnly?)` - Create a short limit order

### Orders Module Methods

- `createLimitOrder(params)` - Create a limit order with full control
- `createLimitOrderSimple(marketId, size, acceptablePrice, options?)` - Simple limit order creation
- `createLimitLongOrder(marketId, size, acceptablePrice, reduceOnly?)` - Long limit order
- `createLimitShortOrder(marketId, size, acceptablePrice, reduceOnly?)` - Short limit order

For more information, see the [Orders API documentation](./orders.md).
