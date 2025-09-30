# Markets API

The Markets module provides market data functionality for accessing real-time market information and statistics.

## Basic Usage

### Get All Markets

```typescript
const markets = await sdk.markets.getMarkets();
console.log(`Found ${markets.length} markets`);
```

### Get Market by Symbol

```typescript
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
console.log(`ETH Price: $${ethMarket?.price}`);
console.log(`Market ID: ${ethMarket?.marketId}`);
```

### Get Market Statistics

```typescript
const stats = await sdk.markets.getMarketStats("market-id");
console.log(`24h Volume: $${stats.tradesVolume24h}`);
console.log(`24h Trades: ${stats.tradesCount24h}`);
```

## SDK Convenience Methods

### Get Market Data (SDK Level)

```typescript
// Get all market data
const allMarkets = await sdk.getMarketData();

// Get specific market data
const ethData = await sdk.getMarketData("ETH");
```

## Complete Example

```typescript
import { PolynomialSDK } from "polynomialfi";

const sdk = await PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234...",
  walletAddress: "0x742d35...",
});

// Get all markets
const markets = await sdk.markets.getMarkets();
console.log(`Found ${markets.length} markets`);

// Get ETH market
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
if (ethMarket) {
  console.log(`ETH Price: $${ethMarket.price}`);
  console.log(`24h Volume: $${ethMarket.tradesVolume24h}`);
  console.log(`Funding Rate: ${ethMarket.currentFundingRate}`);
}

// Get market statistics
const stats = await sdk.markets.getMarketStats(ethMarket.marketId);
console.log(`Open Interest: ${stats.currentOI}`);
```
