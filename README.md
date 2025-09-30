# Polynomial SDK

[![npm version](https://badge.fury.io/js/polynomialfi.svg)](https://badge.fury.io/js/polynomialfi)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-blue?style=flat&logo=discord)](https://discord.gg/polynomial)
[![Bug Reports](https://img.shields.io/badge/Bug%20Reports-GitHub%20Issues-red?style=flat&logo=github)](https://github.com/polynomial-protocol/polynomial-sdk/issues)

A comprehensive TypeScript SDK for interacting with Polynomial Perpetuals, providing easy-to-use methods for trading, account management, and market data access.

## Features

- **Trading**: Create and manage orders with built-in EIP-712 signing
- **Account Management**: Get account information, positions, and margin data
- **Market Data**: Access real-time market information and statistics
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Robust error handling with specific error types

## Installation

```bash
npm install polynomialfi
```

## Quick Start

```typescript
import { PolynomialSDK, parseUnits } from "polynomialfi";

// Initialize the SDK
const sdk = await PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234567890abcdef...",
  walletAddress: "0x742d35Cc6634C0532925a3b8D8d9d4B8e2b3c8a7",
});

// Get market data
const markets = await sdk.markets.getMarkets();
console.log(`Found ${markets.length} markets`);

// Create an order
const order = await sdk.createOrder("market-id", parseUnits("0.1"));
console.log("Order created:", order.id);
```

## Documentation

### API Reference

- **[Accounts API](./docs/accounts.md)** - Account and position management
- **[Orders API](./docs/orders.md)** - Create and manage trading orders
- **[Markets API](./docs/markets.md)** - Market data and statistics

## Configuration

### SDK Options

```typescript
const sdk = await PolynomialSDK.create({
  apiKey: "your-api-key", // Required: Get x-api-key from Discord
  sessionKey: "0x1234...", // Required: Generate/authorize API wallets from here
  walletAddress: "0x742d35...", // Required: Your wallet address
  chainId: 8008, // Optional: Network chain ID (default: 8008)
});
```

## Getting Help

- **Bug Reports**: [GitHub Issues](https://github.com/polynomial-protocol/polynomial-sdk/issues)
- **General Questions**: [Discord Community](https://discord.gg/polynomial)

## License

MIT License - see [LICENSE](LICENSE) file for details.
