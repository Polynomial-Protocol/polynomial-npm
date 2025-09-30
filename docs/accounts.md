# Accounts API

The Accounts module provides account management functionality including account information, position tracking, and margin management.

## Basic Usage

### Get Account Summary

```typescript
const summary = await sdk.accounts.getAccountSummary();
console.log(`Account ID: ${summary.account.accountId}`);
console.log(`Total Positions: ${summary.totalPositions}`);
```

### Get Positions

```typescript
// Get all positions
const positions = await sdk.accounts.getPositions();
console.log(`Found ${positions.length} positions`);

// Get specific position
const position = await sdk.accounts.getPositionByMarket("market-id");
if (position) {
  console.log(`Position Size: ${position.size}`);
  console.log(`Entry Price: $${position.avgEntryPrice}`);
}
```

### Get Margin Information

```typescript
const marginInfo = await sdk.accounts.getMarginInfo();
console.log(`Available Margin: ${marginInfo.availableMargin}`);
console.log(
  `Required Maintenance Margin: ${marginInfo.requiredMaintenanceMargin}`
);
```

### Get Maximum Trade Sizes

```typescript
const tradeSizes = await sdk.accounts.getMaxPossibleTradeSizes("market-id");
console.log(`Max Long Size: ${tradeSizes.maxPossibleTradeSizeForLong}`);
console.log(`Max Short Size: ${tradeSizes.maxPossibleTradeSizeForShort}`);
```

## SDK Convenience Methods

### Get Account Summary (SDK Level)

```typescript
const summary = await sdk.getAccountSummary();
console.log(`Total PnL: $${summary.totalUnrealizedPnl}`);
```

### Get Margin Info (SDK Level)

```typescript
const marginInfo = await sdk.getMarginInfo();
console.log(`Available Margin: ${marginInfo.availableMargin}`);
```

### Get Max Trade Sizes (SDK Level)

```typescript
const tradeSizes = await sdk.getMaxPossibleTradeSizes("market-id");
console.log(`Max Long: ${tradeSizes.maxPossibleTradeSizeForLong}`);
```

## Complete Example

```typescript
import { PolynomialSDK } from "polynomialfi";

const sdk = await PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234...",
  walletAddress: "0x742d35...",
});

// Get account information
const summary = await sdk.getAccountSummary();
const marginInfo = await sdk.getMarginInfo();
const positions = await sdk.accounts.getPositions();

console.log("=== Account Overview ===");
console.log(`Account ID: ${summary.account.accountId}`);
console.log(`Total Positions: ${summary.totalPositions}`);
console.log(`Available Margin: ${marginInfo.availableMargin}`);
console.log(`Positions: ${positions.length}`);
```
