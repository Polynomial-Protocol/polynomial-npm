# Changelog

All notable changes to the Polynomial SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-09-23

### 🎉 Initial Release

The first stable release of the Polynomial SDK - a production-ready TypeScript SDK for Polynomial Perpetuals trading.

### ✨ Added

#### Core SDK Features

- **PolynomialSDK** - Main SDK class with flexible configuration management
- **Markets Module** - Market data fetching and statistics
- **Accounts Module** - Account management and position tracking
- **Orders Module** - Market order creation, signing, and submission
- **HttpClient** - Robust HTTP communication layer with error handling

#### Type Safety & Developer Experience

- Full TypeScript support with comprehensive type definitions
- Multiple build formats: CommonJS, ESM, and TypeScript declarations
- Intuitive API design with convenience methods
- Extensive JSDoc documentation

#### Error Handling

- 8 custom error types for different failure scenarios:
  - `APIError` - API request failures
  - `ValidationError` - Input validation failures
  - `OrderError` - Order operation failures
  - `AccountError` - Account operation failures
  - `MarketError` - Market operation failures
  - `NetworkError` - Network request failures
  - `ConfigurationError` - SDK configuration issues
  - `SigningError` - Order signing failures
- Detailed error context for debugging
- Type-safe error handling patterns

#### Utility Functions

- **Unit Conversion**: `parseUnits()`, `formatUnits()`
- **Price Calculations**: `calculateAcceptablePrice()`, `formatPrice()`, `calculatePositionValue()`
- **Validation**: `isValidAddress()`, `isValidPrivateKey()`
- **Helpers**: `generateNonce()`, `getWeekFromNowTimestamp()`, percentage/basis point conversions

#### Network Support

- Polynomial Mainnet (Chain ID: 8008) support
- Custom network configuration capabilities
- Configurable API endpoints and relayer addresses

#### Testing & Quality

- Comprehensive test suite with 39+ tests
- Jest testing framework with coverage reporting
- Unit tests for utilities and core SDK functionality
- Mocked integration tests for API interactions

#### Documentation & Examples

- Complete README with installation and usage instructions
- Detailed API reference with parameter tables
- Comprehensive examples including trading bot implementation
- Error handling patterns and best practices

### 🏗️ Technical Details

#### Package Structure

```
polynomial-sdk/
├── dist/
│   ├── cjs/          # CommonJS build
│   ├── esm/          # ES Modules build
│   └── types/        # TypeScript declarations
├── src/
│   ├── core/         # Core SDK modules
│   ├── config/       # Configuration management
│   ├── types/        # Type definitions
│   ├── utils/        # Utility functions
│   └── errors/       # Error handling
└── examples/         # Usage examples
```

#### Dependencies

- **Production**: `bignumber.js`, `viem`
- **Development**: TypeScript, Jest, ESLint
- **Node.js**: ≥16.0.0 required

#### Build System

- TypeScript compilation for multiple output formats
- Automated build pipeline with npm scripts
- Type declaration generation
- Source map support

### 🎯 Key Features

1. **Easy Integration** - Simple npm install and intuitive API
2. **Type Safety** - Full TypeScript support with comprehensive types
3. **Production Ready** - Robust error handling and validation
4. **High Performance** - Optimized for speed with minimal dependencies
5. **Flexible Configuration** - Support for custom networks and endpoints
6. **Comprehensive Testing** - Well-tested with high code coverage
7. **Great Documentation** - Complete API docs and examples

### 📦 Installation

```bash
npm install polynomial-sdk
```

### 🚀 Quick Start

```typescript
import { PolynomialSDK, parseUnits } from "polynomial-sdk";

const sdk = PolynomialSDK.create({
  apiKey: "your-api-key",
  sessionKey: "0x1234...",
  walletAddress: "0x742d35...",
});

const ethMarket = await sdk.markets.getMarketBySymbol("ETH");
const orderResult = await sdk.createOrder(
  ethMarket.marketId,
  parseUnits("0.1")
);
```

---

## Future Releases

### Planned Features for v1.1.0

- [ ] WebSocket support for real-time market data
- [ ] Advanced order types (limit orders, stop-loss)
- [ ] Portfolio management utilities
- [ ] Performance analytics
- [ ] React hooks for frontend integration

### Planned Features for v1.2.0

- [ ] Multi-account support
- [ ] Batch operations
- [ ] Advanced risk management tools
- [ ] Historical data access
- [ ] GraphQL support

---

For more information, visit:

- 📖 [Documentation](https://docs.polynomial.fi)
- 💬 [Discord](https://discord.gg/polynomial)
- 🌐 [Website](https://polynomial.fi)
