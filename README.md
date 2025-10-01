# Polynomial SDK

<div align="center">

**Official TypeScript SDK for Polynomial Perpetuals**

_Trade crypto perpetuals with ease using a type-safe SDK_

> ⚠️ This package is in early beta and may have minor issues. We strive to improve it continuously.

[![npm version](https://img.shields.io/npm/v/polynomialfi.svg)](https://www.npmjs.com/package/polynomialfi)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?style=flat&logo=discord)](https://discord.gg/polynomial)

[Quick Start](#quick-start) • [Documentation](#documentation) • [Support](#getting-help)

</div>

---

## ✨ Features

- 🚀 **Easy to use** - Simple, intuitive API for all trading operations
- 🔒 **Type-safe** - Full TypeScript support with comprehensive type definitions
- 📊 **Market data** - Real-time market information and statistics
- 💼 **Account management** - Account and position management
- 📝 **Order management** - Create, sign, and submit market and limit orders
- 📊 **Trade analysis** - Post-trade analysis with fees, health factor, and feasibility
- 🛡️ **Error handling** - Comprehensive error types and handling
- ⚡ **High performance** - Optimized for speed with minimal dependencies

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

- **[Accounts API](https://github.com/Polynomial-Protocol/polynomial-npm/blob/master/docs/accounts.md)** - Account and position management
- **[Orders API](https://github.com/Polynomial-Protocol/polynomial-npm/blob/master/docs/orders.md)** - Create and manage trading orders
- **[Markets API](https://github.com/Polynomial-Protocol/polynomial-npm/blob/master/docs/markets.md)** - Market data and statistics

## Configuration

### Required Credentials

| Credential        | Description                    | How to Get                                                                                 |
| ----------------- | ------------------------------ | ------------------------------------------------------------------------------------------ |
| **apiKey**        | API authentication (x-api-key) | Get from [Discord](https://discord.gg/polynomial)                                          |
| **sessionKey**    | Private key for signing orders | Generate/authorize API wallets from [here](https://polynomial.fi/en/mainnet/portfolio/api) |
| **walletAddress** | Your trading wallet address    | Your Ethereum wallet address                                                               |

```typescript
const sdk = await PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234...",
  walletAddress: "0x742d35...",
  chainId: 8008, // Optional: Network chain ID (default: 8008)
});
```

## Getting Help

- **Bug Reports**: [GitHub Issues](https://github.com/Polynomial-Protocol/polynomial-npm/issues)
- **General Questions**: [Discord Community](https://discord.gg/polynomial)

## License

MIT License - see [LICENSE](LICENSE) file for details.
