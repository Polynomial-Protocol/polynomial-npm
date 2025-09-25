# Polynomial SDK

<div align="center">

> ## 🚧 **WORK IN PROGRESS** 🚧
>
> ### ✨ Something magical is brewing! ✨
>
> **This SDK is currently under active development**
>
> 🔮 **Come back in a few days and witness the magic!** 🔮
>
> We're crafting something extraordinary for the Polynomial ecosystem.
>
> ---

**Official TypeScript SDK for Polynomial Perpetuals**

_Trade crypto perpetuals with ease using a production-ready, type-safe SDK_

[![npm version](https://img.shields.io/npm/v/polynomialfi.svg)](https://www.npmjs.com/package/polynomialfi)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Test Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen.svg)]()

[Quick Start](#quick-start) • [Documentation](#api-reference) • [Examples](#examples) • [Support](#support)

</div>

---

## ✨ Features

- 🚀 **Easy to use** - Simple, intuitive API for all trading operations
- 🔒 **Type-safe** - Full TypeScript support with comprehensive type definitions
- 🌐 **Multi-network** - Support for different Polynomial deployments
- 📊 **Market data** - Real-time market information and statistics
- 💼 **Account management** - Account and position management
- 📝 **Order management** - Create, sign, and submit market orders
- 🛡️ **Error handling** - Comprehensive error types and handling
- 🧪 **Well tested** - Extensive test coverage with 39+ tests
- 📖 **Well documented** - Complete API documentation and examples
- ⚡ **High performance** - Optimized for speed with minimal dependencies
- 🔄 **Multiple formats** - CommonJS, ESM, and TypeScript declarations
- 🎯 **Production ready** - Battle-tested architecture with robust error handling

## 🏗️ Architecture

The SDK is built with a modular architecture:

```
polynomial-sdk/
├── 🎯 PolynomialSDK     # Main SDK class
├── 📊 Markets           # Market data & trade simulation
├── 👤 Accounts          # Account & position management
├── 📝 Orders            # Order creation & signing
├── 🌐 HttpClient        # HTTP communication layer
├── ⚙️  Config           # Network configurations
├── 🛠️  Utils            # Utility functions
└── ❌ Errors            # Custom error types
```

## 📦 Installation

```bash
# Using npm
npm install polynomialfi

# Using yarn
yarn add polynomialfi

# Using pnpm
pnpm add polynomialfi
```

### Requirements

- Node.js ≥ 16.0.0
- TypeScript ≥ 4.5.0 (for TypeScript projects)

## 🚀 Quick Start

```typescript
import { PolynomialSDK, parseUnits } from "polynomialfi";

// 1. Initialize the SDK
const sdk = PolynomialSDK.create({
  apiKey: "your-api-key",
  chainId: 8008, // Polynomial mainnet
});

// 2. Get market data
const markets = await sdk.markets.getMarkets();
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
console.log(`ETH Price: $${ethMarket?.price}`);

// 3. Get account information
const accountSummary = await sdk.getAccountSummary("your-wallet-address");
console.log(`Total Positions: ${accountSummary.totalPositions}`);

// 4. Simulate a trade
const simulation = await sdk.markets.simulateTrade({
  accountId: accountSummary.account.accountId,
  marketId: ethMarket!.marketId,
  sizeDelta: parseUnits("0.1"), // 0.1 ETH long
});

// 5. Create a market order (if simulation is feasible)
if (simulation.feasible) {
  const orderResult = await sdk.createMarketOrderWithSimulation(
    "your-session-key",
    "your-wallet-address",
    "ETH",
    parseUnits("0.1"), // 0.1 ETH
    true, // Long position
    10n // 10% max slippage
  );
  console.log("Order submitted:", orderResult);
}
```

> **💡 Tip**: Check out the [examples directory](./examples/) for complete working examples!

## ⚙️ Configuration

### Basic Configuration

```typescript
import { PolynomialSDK } from "polynomialfi";

const sdk = PolynomialSDK.create({
  apiKey: "your-api-key", // Required
  chainId: 8008, // Optional, defaults to 8008 (Polynomial mainnet)
  defaultSlippage: 10n, // Optional, defaults to 10n (10%)
});
```

### Advanced Configuration

```typescript
const sdk = PolynomialSDK.create({
  apiKey: "your-api-key",
  chainId: 8008,
  apiEndpoint: "https://custom-api.example.com",
  orderbookEndpoint: "https://custom-orderbook.example.com/api",
  relayerAddress: "0x...",
  defaultSlippage: 5n,
});
```

## 📚 API Reference

### SDK Initialization

#### `PolynomialSDK.create(config: SDKConfig)`

Creates a new SDK instance.

**Parameters:**

| Parameter           | Type     | Required | Default           | Description                    |
| ------------------- | -------- | -------- | ----------------- | ------------------------------ |
| `apiKey`            | `string` | ✅       | -                 | Your API key from Polynomial   |
| `chainId`           | `number` | ❌       | `8008`            | Network chain ID               |
| `apiEndpoint`       | `string` | ❌       | Mainnet API       | Custom API endpoint            |
| `orderbookEndpoint` | `string` | ❌       | Mainnet orderbook | Custom orderbook endpoint      |
| `relayerAddress`    | `string` | ❌       | Default relayer   | Custom relayer address         |
| `defaultSlippage`   | `bigint` | ❌       | `10n`             | Default slippage tolerance (%) |

**Returns:** `PolynomialSDK` instance

**Example:**

```typescript
const sdk = PolynomialSDK.create({
  apiKey: "your-api-key",
  chainId: 8008,
  defaultSlippage: 5n, // 5% slippage
});
```

### 📊 Markets Module

#### `sdk.markets.getMarkets(filters?)`

Fetches all available markets with optional filtering.

**Parameters:**

- `filters.symbol` (optional) - Filter by market symbol
- `filters.marketId` (optional) - Filter by market ID

**Returns:** `Promise<IMarkets[]>`

```typescript
// Get all markets
const markets = await sdk.markets.getMarkets();

// Filter by symbol
const ethMarkets = await sdk.markets.getMarkets({ symbol: "ETH" });
```

#### `sdk.markets.getMarketBySymbol(symbol)`

Gets a specific market by symbol.

**Parameters:**

- `symbol` - Market symbol (e.g., "ETH", "BTC")

**Returns:** `Promise<IMarkets | null>`

```typescript
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
if (ethMarket) {
  console.log(`ETH Price: $${ethMarket.price}`);
}
```

#### `sdk.markets.simulateTrade(params)`

Simulates a trade before execution to preview outcomes.

**Parameters:**

- `accountId` - Account ID
- `marketId` - Market ID
- `sizeDelta` - Position size change (positive for long, negative for short)

**Returns:** `Promise<IPostTradeDetails>`

```typescript
const simulation = await sdk.markets.simulateTrade({
  accountId: "account-id",
  marketId: "market-id",
  sizeDelta: parseUnits("0.1"), // 0.1 ETH long
});

console.log(`Fill Price: $${simulation.fillPrice}`);
console.log(`Total Fees: $${simulation.totalFees}`);
console.log(`Feasible: ${simulation.feasible}`);
```

#### `sdk.markets.getMarketStats(marketId)`

Gets detailed statistics for a specific market.

**Returns:** `Promise<Partial<IMarkets>>`

```typescript
const stats = await sdk.markets.getMarketStats("market-id");
console.log(`24h Volume: $${stats.tradesVolume24h}`);
```

### 👤 Accounts Module

#### `sdk.accounts.getAccount(walletAddress)`

Gets account information for a wallet address.

**Parameters:**

- `walletAddress` - Ethereum wallet address

**Returns:** `Promise<IAccountAPIResponse | null>`

```typescript
const account = await sdk.accounts.getAccount(
  "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7"
);
if (account) {
  console.log(`Account ID: ${account.accountId}`);
}
```

#### `sdk.accounts.getPositions(accountId)`

Gets all open positions for an account.

**Parameters:**

- `accountId` - Account ID

**Returns:** `Promise<IPosition[]>`

```typescript
const positions = await sdk.accounts.getPositions("account-id");
positions.forEach((position, index) => {
  console.log(`Position ${index + 1}:`);
  console.log(`  Market: ${position.marketId}`);
  console.log(`  Size: ${position.size}`);
  console.log(`  PnL: $${position.totalRealisedPnlUsd}`);
});
```

#### `sdk.accounts.getAccountSummary(accountId)`

Gets comprehensive account summary with positions and metrics.

**Parameters:**

- `accountId` - Account ID

**Returns:** `Promise<AccountSummary>`

```typescript
const summary = await sdk.accounts.getAccountSummary("account-id");
console.log(`Total Positions: ${summary.totalPositions}`);
console.log(`Total PnL: $${summary.totalRealizedPnl}`);
```

#### `sdk.accounts.getPositionByMarket(accountId, marketId)`

Gets a specific position for a market.

**Returns:** `Promise<IPosition | null>`

```typescript
const position = await sdk.accounts.getPositionByMarket(
  "account-id",
  "eth-market-id"
);
```

### 📝 Orders Module

#### `sdk.orders.createMarketOrder(sessionKey, walletAddress, accountId, params)`

Creates, signs, and submits a market order.

**Parameters:**

- `sessionKey` - Private key for signing orders
- `walletAddress` - Wallet address
- `accountId` - Account ID
- `params` - Order parameters

**Returns:** `Promise<OrderResult>`

```typescript
const result = await sdk.orders.createMarketOrder(
  "0x1234...", // session key
  "0x742d...", // wallet address
  "account-id",
  {
    marketId: "eth-market-id",
    size: parseUnits("0.1"), // 0.1 ETH
    isLong: true, // Long position
    acceptablePrice: parseUnits("2000"), // Max $2000
  }
);
```

#### `sdk.orders.createLongOrder(...)`

Convenience method for creating long positions.

```typescript
const result = await sdk.orders.createLongOrder(
  sessionKey,
  walletAddress,
  accountId,
  "eth-market-id",
  parseUnits("0.1"), // size
  parseUnits("2000") // acceptable price
);
```

#### `sdk.orders.createShortOrder(...)`

Convenience method for creating short positions.

```typescript
const result = await sdk.orders.createShortOrder(
  sessionKey,
  walletAddress,
  accountId,
  "eth-market-id",
  parseUnits("0.1"), // size
  parseUnits("1800") // acceptable price
);
```

### 🎯 Convenience Methods

#### `sdk.createMarketOrderWithSimulation(...)`

Creates a market order with automatic trade simulation and validation.

**Parameters:**

- `sessionKey` - Private key for signing
- `walletAddress` - Wallet address
- `marketSymbol` - Market symbol (e.g., "ETH")
- `size` - Position size
- `isLong` - Position direction
- `maxSlippage` - Maximum slippage tolerance

**Returns:** `Promise<{ simulation, orderResult }>`

```typescript
const result = await sdk.createMarketOrderWithSimulation(
  "0x1234...", // session key
  "0x742d...", // wallet address
  "ETH",
  parseUnits("0.1"), // 0.1 ETH
  true, // Long position
  15n // 15% max slippage
);

console.log("Trade simulation:", result.simulation);
console.log("Order result:", result.orderResult);
```

#### `sdk.getAccountSummary(walletAddress)`

Gets comprehensive account summary by wallet address.

**Returns:** `Promise<AccountSummary>`

```typescript
const summary = await sdk.getAccountSummary(
  "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7"
);
console.log(`Account: ${summary.account.accountId}`);
console.log(`Positions: ${summary.totalPositions}`);
```

#### `sdk.getMarketData(symbol?)`

Gets market data, optionally filtered by symbol.

```typescript
// Get specific market
const ethData = await sdk.getMarketData("ETH");

// Get all markets
const allMarkets = await sdk.getMarketData();
```

## 🛠️ Utilities

The SDK includes powerful utility functions for common operations:

### Unit Conversion

```typescript
import { parseUnits, formatUnits } from "polynomial-sdk";

// Convert human-readable values to base units (18 decimals)
const amount = parseUnits("1.5"); // 1.5 ETH -> 1500000000000000000n
const custom = parseUnits("100", 6); // 100 USDC -> 100000000n (6 decimals)

// Convert base units to human-readable values
const formatted = formatUnits(1500000000000000000n); // -> "1.5"
const usdcFormatted = formatUnits(100000000n, 6); // -> "100"
```

### Price Calculations

```typescript
import {
  calculateAcceptablePrice,
  formatPrice,
  calculatePositionValue,
} from "polynomial-sdk";

// Calculate acceptable price with slippage protection
const acceptablePrice = calculateAcceptablePrice(
  parseUnits("2000"), // Market price: $2000
  5n, // 5% slippage tolerance
  true // Long position (adds slippage)
);
// Result: $2100 (2000 + 5%)

// Format prices for display
const displayPrice = formatPrice(parseUnits("2000.1234"), 18, 2); // -> "2000.12"

// Calculate position USD value
const positionValue = calculatePositionValue(
  parseUnits("0.5"), // 0.5 ETH position
  parseUnits("2000") // $2000/ETH price
); // -> "1000.00"
```

### Validation & Utilities

```typescript
import {
  isValidAddress,
  isValidPrivateKey,
  generateNonce,
  percentageToBasisPoints,
} from "polynomial-sdk";

// Address validation
const validAddress = isValidAddress(
  "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7"
); // true
const invalidAddress = isValidAddress("invalid-address"); // false

// Private key validation
const validKey = isValidPrivateKey("0x1234..."); // true/false

// Generate unique nonces for orders
const nonce = generateNonce(); // "1640995200000"

// Convert percentages to basis points
const basisPoints = percentageToBasisPoints(1.5); // 150 (1.5% = 150 bp)
```

## ❌ Error Handling

The SDK provides comprehensive, typed error handling for robust applications:

### Error Types

| Error Type           | Description              | When It Occurs                      |
| -------------------- | ------------------------ | ----------------------------------- |
| `APIError`           | API request failed       | Invalid API response, rate limits   |
| `ValidationError`    | Input validation failed  | Invalid addresses, parameters       |
| `OrderError`         | Order operation failed   | Order creation/submission issues    |
| `AccountError`       | Account operation failed | Account not found, access issues    |
| `MarketError`        | Market operation failed  | Market not found, data issues       |
| `NetworkError`       | Network request failed   | Connection issues, timeouts         |
| `ConfigurationError` | SDK config invalid       | Missing API key, invalid config     |
| `SigningError`       | Order signing failed     | Invalid session key, signing issues |

### Error Handling Patterns

```typescript
import {
  PolynomialSDKError,
  APIError,
  ValidationError,
  OrderError,
  isPolynomialSDKError,
} from "polynomial-sdk";

try {
  const result = await sdk.createMarketOrderWithSimulation(
    sessionKey,
    walletAddress,
    "ETH",
    parseUnits("0.1"),
    true,
    10n
  );
} catch (error) {
  // Type-safe error handling
  if (error instanceof APIError) {
    console.error(`API Error [${error.status}]:`, error.message);
    console.error("Response:", error.response);
  } else if (error instanceof ValidationError) {
    console.error("Validation Error:", error.message);
    console.error("Context:", error.context);
  } else if (error instanceof OrderError) {
    console.error("Order Error:", error.message);
    // Maybe retry or show user-friendly message
  } else if (isPolynomialSDKError(error)) {
    console.error(`SDK Error [${error.code}]:`, error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### Error Context

All SDK errors include helpful context for debugging:

```typescript
try {
  await sdk.accounts.getAccount("invalid-address");
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.message); // "Invalid wallet address format"
    console.log(error.context); // { walletAddress: "invalid-address" }
    console.log(error.code); // "VALIDATION_ERROR"
  }
}
```

## 📖 Examples

The SDK includes comprehensive examples to get you started quickly:

### 🚀 [Basic Usage](./examples/basic-usage.ts)

Complete example showing SDK initialization, market data fetching, account management, and order creation.

```typescript
// Key highlights from basic usage example:
const sdk = PolynomialSDK.create({ apiKey: "your-key" });
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
const accountSummary = await sdk.getAccountSummary(walletAddress);
const simulation = await sdk.markets.simulateTrade({...});
```

### 🏗️ Complete Trading Bot Example

```typescript
import { PolynomialSDK, parseUnits } from "polynomialfi";

class TradingBot {
  private sdk: PolynomialSDK;

  constructor(apiKey: string) {
    this.sdk = PolynomialSDK.create({
      apiKey,
      defaultSlippage: 5n, // 5% slippage tolerance
    });
  }

  async executeStrategy() {
    // Get market data
    const ethMarket = await this.sdk.markets.getMarketBySymbol("ETH");
    if (!ethMarket) throw new Error("ETH market not found");

    // Check account
    const summary = await this.sdk.getAccountSummary(WALLET_ADDRESS);
    console.log(`Account has ${summary.totalPositions} positions`);

    // Execute trade based on your strategy
    if (this.shouldTrade(ethMarket)) {
      const result = await this.sdk.createMarketOrderWithSimulation(
        SESSION_KEY,
        WALLET_ADDRESS,
        "ETH",
        parseUnits("0.1"),
        true, // Long
        10n // 10% slippage
      );

      console.log("Trade executed:", result.orderResult);
    }
  }

  private shouldTrade(market: IMarkets): boolean {
    // Your trading logic here
    return market.price > 2000 && parseFloat(market.currentFundingRate) < 0.01;
  }
}
```

## 🛠️ Development

### Building the Package

```bash
# Clean and build all formats
npm run build

# Build specific formats
npm run build:cjs    # CommonJS
npm run build:esm    # ES Modules
npm run build:types  # TypeScript declarations
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Code Quality

```bash
# Lint TypeScript files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Type checking
npx tsc --noEmit
```

## 🔐 API Key Setup

To use this SDK, you need the following credentials:

### Required Credentials

| Credential         | Description                                 | How to Get                                                           |
| ------------------ | ------------------------------------------- | -------------------------------------------------------------------- |
| **API Key**        | Authentication for API access               | Contact Polynomial team via [Discord](https://discord.gg/polynomial) |
| **Session Key**    | Private key for signing orders (Nitro Mode) | Generate or use existing private key                                 |
| **Wallet Address** | Your primary trading wallet address         | Your Ethereum wallet address                                         |

### Environment Setup

```bash
# .env file
POLYNOMIAL_API_KEY=your_api_key_here
SESSION_KEY=0x1234567890abcdef...
WALLET_ADDRESS=0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7
```

```typescript
// In your application
const sdk = PolynomialSDK.create({
  apiKey: process.env.POLYNOMIAL_API_KEY!,
});
```

## 🌐 Network Support

| Network                | Chain ID | Status       | Description                |
| ---------------------- | -------- | ------------ | -------------------------- |
| **Polynomial Mainnet** | 8008     | ✅ Active    | Production trading network |
| **Custom Networks**    | Any      | ✅ Supported | Configure custom endpoints |

### Custom Network Configuration

```typescript
const sdk = PolynomialSDK.create({
  apiKey: "your-api-key",
  chainId: 1337,
  apiEndpoint: "https://your-custom-api.com",
  orderbookEndpoint: "https://your-custom-orderbook.com/api",
});
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/polynomial-protocol/polynomial-sdk.git
cd polynomial-sdk

# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build
```

### Contribution Guidelines

- 🐛 **Bug Reports**: Use GitHub issues with detailed reproduction steps
- 💡 **Feature Requests**: Discuss in GitHub issues before implementing
- 📝 **Documentation**: Help improve examples and API docs
- 🧪 **Testing**: Add tests for new features and bug fixes

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Ensure all tests pass (`npm test`)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support & Community

Get help and connect with the community:

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?style=for-the-badge&logo=discord)](https://discord.gg/polynomial)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1da1f2?style=for-the-badge&logo=twitter)](https://twitter.com/PolynomialFi)
[![Documentation](https://img.shields.io/badge/Docs-Read-blue?style=for-the-badge&logo=gitbook)](https://docs.polynomial.fi)
[![Website](https://img.shields.io/badge/Website-Visit-green?style=for-the-badge&logo=globe)](https://polynomial.fi)

</div>

### Getting Help

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/polynomial-protocol/polynomial-sdk/issues)
- 💬 **General Questions**: [Discord Community](https://discord.gg/polynomial)
- 📚 **Documentation**: [Official Docs](https://docs.polynomial.fi)
- 📧 **Business Inquiries**: team@polynomial.fi

## 📋 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for detailed release history and breaking changes.

## 🙏 Acknowledgments

Special thanks to:

- The Polynomial Protocol team for building an amazing perpetuals platform
- The TypeScript and Node.js communities for excellent tooling
- All contributors who help improve this SDK

---

<div align="center">

**Built with ❤️ by the [Polynomial Protocol](https://polynomial.fi) team**

_Empowering the next generation of DeFi trading_

</div>
