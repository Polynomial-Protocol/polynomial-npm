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
├── 📊 Markets           # Market data & information
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

// Initialize the SDK with all required credentials
const sdk = PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234567890abcdef...", // Your private key for signing
  walletAddress: "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7", // Your wallet
});

// Get ETH market data
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
console.log(`ETH Price: $${ethMarket?.price}`);

// Create a simple order - credentials are already stored in SDK
const result = await sdk.createOrder(
  ethMarket.marketId,
  parseUnits("0.1") // 0.1 ETH
);
```

> **💡 Tip**: Check out the [examples directory](./examples/) for complete working examples!

## ⚙️ Configuration

### Required Configuration

All SDK instances require these credentials:

```typescript
const sdk = PolynomialSDK.create({
  apiKey: "your-api-key",           // Required: API authentication
  sessionKey: "0x1234...",          // Required: Private key for signing orders
  walletAddress: "0x742d35...",     // Required: Your trading wallet address
});
```

### Advanced Configuration

```typescript
const sdk = PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234...",
  walletAddress: "0x742d35...",
  chainId: 8008,                    // Optional: Network chain ID
  defaultSlippage: 5n,              // Optional: Default slippage (5%)
  apiEndpoint: "https://...",       // Optional: Custom API endpoint
  orderbookEndpoint: "https://...", // Optional: Custom orderbook endpoint
});
```

## 📚 API Reference

### SDK Initialization

#### `PolynomialSDK.create(config: SDKConfig)`

Creates a new SDK instance.

**Parameters:**

| Parameter           | Type     | Required | Default           | Description                                   |
| ------------------- | -------- | -------- | ----------------- | --------------------------------------------- |
| `apiKey`            | `string` | ✅       | -                 | Your API key from Polynomial                  |
| `sessionKey`        | `string` | ✅       | -                 | Your private key for signing orders           |
| `walletAddress`     | `string` | ✅       | -                 | Your trading wallet address                   |
| `chainId`           | `number` | ❌       | `8008`            | Network chain ID                              |
| `apiEndpoint`       | `string` | ❌       | Mainnet API       | Custom API endpoint                           |
| `orderbookEndpoint` | `string` | ❌       | Mainnet orderbook | Custom orderbook endpoint                     |
| `relayerAddress`    | `string` | ❌       | Default relayer   | Custom relayer address                        |
| `defaultSlippage`   | `bigint` | ❌       | `10n`             | Default slippage tolerance (%)                |

**Returns:** `PolynomialSDK` instance

**Example:**

```typescript
const sdk = PolynomialSDK.create({ 
  apiKey: "your-api-key",
  sessionKey: "0x1234567890abcdef...",
  walletAddress: "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7"
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
const markets = await sdk.markets.getMarkets();
const ethMarkets = await sdk.markets.getMarkets({ symbol: "ETH" });
```

#### `sdk.markets.getMarketBySymbol(symbol)`

Gets a specific market by symbol.

**Parameters:**

- `symbol` - Market symbol (e.g., "ETH", "BTC")

**Returns:** `Promise<IMarkets | null>`

```typescript
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
console.log(`ETH Price: $${ethMarket?.price}`);
```

#### `sdk.markets.getMarketStats(marketId)`

Gets detailed statistics for a specific market.

**Returns:** `Promise<Partial<IMarkets>>`

```typescript
const stats = await sdk.markets.getMarketStats("market-id");
```

### 👤 Accounts Module

#### `sdk.accounts.getAccount(walletAddress)`

Gets account information for a wallet address.

**Parameters:**

- `walletAddress` - Ethereum wallet address

**Returns:** `Promise<IAccountAPIResponse | null>`

```typescript
const account = await sdk.accounts.getAccount("0x742d35...");
console.log(`Account ID: ${account?.accountId}`);
```

#### `sdk.accounts.getPositions(accountId)`

Gets all open positions for an account.

**Parameters:**

- `accountId` - Account ID

**Returns:** `Promise<IPosition[]>`

```typescript
const positions = await sdk.accounts.getPositions("account-id");
console.log(`Found ${positions.length} positions`);
```

#### `sdk.accounts.getAccountSummary(accountId)`

Gets comprehensive account summary with positions and metrics.

**Parameters:**

- `accountId` - Account ID

**Returns:** `Promise<AccountSummary>`

```typescript
const summary = await sdk.accounts.getAccountSummary("account-id");
console.log(`Total Positions: ${summary.totalPositions}`);
```

#### `sdk.accounts.getPositionByMarket(accountId, marketId)`

Gets a specific position for a market.

**Returns:** `Promise<IPosition | null>`

```typescript
const position = await sdk.accounts.getPositionByMarket(
  "account-id",
  "market-id"
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
  sessionKey,
  walletAddress,
  accountId,
  {
    marketId: "market-id",
    size: parseUnits("0.1"),
    isLong: true,
    acceptablePrice: parseUnits("2000"),
  }
);
```

#### `sdk.orders.createLongOrder(...)`

Convenience method for creating long positions. Acceptable price is now optional and will be calculated automatically if not provided.

```typescript
// With automatic price calculation
const result = await sdk.orders.createLongOrder(
  sessionKey,
  walletAddress,
  accountId,
  "market-id",
  parseUnits("0.1")
);

// With custom acceptable price
const result = await sdk.orders.createLongOrder(
  sessionKey,
  walletAddress,
  accountId,
  "market-id",
  parseUnits("0.1"),
  parseUnits("2000")
);
```

#### `sdk.orders.createShortOrder(...)`

Convenience method for creating short positions. Acceptable price is now optional and will be calculated automatically if not provided.

```typescript
// With automatic price calculation
const result = await sdk.orders.createShortOrder(
  sessionKey,
  walletAddress,
  accountId,
  "market-id",
  parseUnits("0.1")
);
```

### 🎯 Convenience Methods

#### `sdk.createOrder(marketId, size, options?)`

Creates a market order with minimal parameters. Only `marketId` and `size` are required - everything else uses intelligent defaults. Uses the credentials provided during SDK initialization.

**Parameters:**

- `marketId` - Market ID to trade
- `size` - Position size
- `options` (optional) - Additional options:
  - `isLong` - Position direction (default: `true`)
  - `acceptablePrice` - Custom acceptable price (default: calculated from market price + slippage)
  - `reduceOnly` - Reduce-only order (default: `false`)
  - `slippagePercentage` - Custom slippage (default: uses SDK default)

**Returns:** `Promise<OrderResult>`

**Default Behavior:**

- **Position Direction**: Defaults to long (`isLong: true`)
- **Acceptable Price**: Automatically fetched from market data and calculated with slippage protection
- **Slippage**: Uses SDK default (10%) or custom value
- **Reduce Only**: Defaults to `false`

```typescript
// Minimal usage - only marketId and size required
const result = await sdk.createOrder(
  "market-id",
  parseUnits("0.1")
);

// With custom options
const result = await sdk.createOrder(
  "market-id",
  parseUnits("0.1"),
  {
    isLong: false, // Short position
    slippagePercentage: 5n, // 5% slippage
  }
);
```

#### `sdk.getAccountSummary()`

Gets comprehensive account summary for the wallet address provided during SDK initialization.

**Returns:** `Promise<AccountSummary>`

```typescript
const summary = await sdk.getAccountSummary();
console.log(`Account: ${summary.account.accountId}`);
```

#### `sdk.getMarketData(symbol?)`

Gets market data, optionally filtered by symbol.

```typescript
const ethData = await sdk.getMarketData("ETH");
const allMarkets = await sdk.getMarketData();
```

## 🛠️ Utilities

The SDK includes powerful utility functions for common operations:

### Unit Conversion

```typescript
import { parseUnits, formatUnits } from "polynomialfi";

const amount = parseUnits("1.5"); // 1.5 ETH -> 1500000000000000000n
const formatted = formatUnits(amount); // -> "1.5"
```

### Price Calculations

```typescript
import { calculateAcceptablePrice } from "polynomialfi";

const acceptablePrice = calculateAcceptablePrice(
  parseUnits("2000"), // Market price
  5n, // 5% slippage
  true // Long position
);
```

### Validation & Utilities

```typescript
import { isValidAddress, generateNonce } from "polynomialfi";

const isValid = isValidAddress("0x742d35...");
const nonce = generateNonce();
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
import { APIError, ValidationError } from "polynomialfi";

try {
  const result = await sdk.orders.createLongOrder(
    sessionKey,
    walletAddress,
    accountId,
    "market-id",
    parseUnits("0.1"),
    parseUnits("2000")
  );
} catch (error) {
  if (error instanceof APIError) {
    console.error("API Error:", error.message);
  } else if (error instanceof ValidationError) {
    console.error("Validation Error:", error.message);
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
    console.log(error.message);
    console.log(error.context);
  }
}
```

## 📖 Examples

The SDK includes comprehensive examples to get you started quickly:

### 🚀 [Basic Usage](./examples/basic-usage.ts)

Complete example showing SDK initialization, market data fetching, and account management.

```typescript
const sdk = PolynomialSDK.create({ apiKey: "your-key" });
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
const accountSummary = await sdk.getAccountSummary(walletAddress);
```

### 🏗️ Simple Trading Example

```typescript
import { PolynomialSDK, parseUnits } from "polynomialfi";

// Initialize SDK with all required credentials
const sdk = PolynomialSDK.create({ 
  apiKey: "your-key",
  sessionKey: "0x1234567890abcdef...", // Your private key for signing
  walletAddress: "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7", // Your wallet
});

// Get market data
const ethMarket = await sdk.markets.getMarketBySymbol("ETH");

// Create a simple order - only marketId and size required!
const result = await sdk.createOrder(
  ethMarket.marketId,
  parseUnits("0.1") // 0.1 ETH long position (default)
);

// Or create a short position with custom slippage
const shortResult = await sdk.createOrder(
  ethMarket.marketId,
  parseUnits("0.1"),
  { isLong: false, slippagePercentage: 5n }
);
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

## 🔐 Authentication & Credentials

The SDK requires all credentials to be provided during initialization. This ensures secure and consistent authentication throughout the session.

### Required Credentials

| Credential         | Description                              | Required For     | How to Get                                                           |
| ------------------ | ---------------------------------------- | ---------------- | -------------------------------------------------------------------- |
| **API Key**        | Authentication for API access            | All operations   | Contact Polynomial team via [Discord](https://discord.gg/polynomial) |
| **Session Key**    | Private key for signing orders (EIP-712) | Order operations | Generate or use existing private key                                 |
| **Wallet Address** | Your primary trading wallet address      | Order operations | Your Ethereum wallet address                                         |

### Authentication Flow

All credentials must be provided when creating the SDK instance:

```typescript
const sdk = PolynomialSDK.create({
  apiKey: "your-api-key",           // Required for API access
  sessionKey: "0x1234...",          // Required for signing orders
  walletAddress: "0x742d35...",     // Required for trading operations
});

// All trading methods use the stored credentials
const result = await sdk.createOrder(marketId, size);
const summary = await sdk.getAccountSummary();
```

### Error Handling for Missing Credentials

The SDK validates credentials during initialization and throws clear errors:

```typescript
try {
  const sdk = PolynomialSDK.create({
    apiKey: "your-api-key",
    // Missing sessionKey and walletAddress
  });
} catch (error) {
  // "Session key is required for SDK initialization"
  // "Wallet address is required for SDK initialization"
  console.error(error.message);
}
```

### Credential Security

- **Session Key**: Keep this private and secure. It's used to sign all order transactions
- **API Key**: Treat as confidential. Required for all API access
- **Wallet Address**: Public address of your trading account

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
  sessionKey: process.env.SESSION_KEY!,
  walletAddress: process.env.WALLET_ADDRESS!,
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
