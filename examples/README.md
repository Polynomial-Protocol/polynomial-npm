# Polynomial SDK Examples

This directory contains example usage of the **polynomialfi** npm package.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Examples

**JavaScript version:**

```bash
npm start
# or
node basic-usage.js
```

**TypeScript version:**

```bash
npm run start:ts
# or
npx ts-node -P ./tsconfig.json basic-usage.ts
```

### 3. Development Mode (with auto-reload)

**JavaScript:**

```bash
npm run dev
```

**TypeScript:**

```bash
npm run dev:ts
```

## 📋 What the Examples Demonstrate

The example scripts showcase:

- ✅ **SDK Initialization** - Setting up the Polynomial SDK
- ✅ **Market Data** - Fetching available markets and prices
- ✅ **Account Management** - Getting account information and positions
- ✅ **Trade Simulation** - Simulating trades before execution
- ✅ **Order Creation** - Creating and signing market orders
- ✅ **Error Handling** - Proper error handling patterns

## 🔧 Configuration

The examples use environment variables for configuration:

```bash
# Optional - for full functionality
export POLYNOMIAL_API_KEY="your-api-key"
export SESSION_KEY="your-session-key"
export WALLET_ADDRESS="your-wallet-address"
```

**Demo Mode**: If you don't provide these environment variables, the examples will run in demo mode, showing market data and error handling without requiring real credentials.

## 📁 Files

- `basic-usage.js` - CommonJS version of the example
- `basic-usage.ts` - TypeScript version of the example
- `tsconfig.json` - TypeScript configuration for examples
- `package.json` - npm package configuration
- `README.md` - This file

## 🌐 Package Information

This example uses the **polynomialfi** npm package:

```bash
npm install polynomialfi
```

For more information, visit: https://www.npmjs.com/package/polynomialfi

## 🎯 Expected Output

When you run the examples, you should see:

```
🎯 Polynomial SDK Examples

🚀 Initializing Polynomial SDK...
✅ SDK initialized successfully
Network config: { ... }

📊 Fetching market data...
Found 76 markets
ETH Market: { ... }

⚠️  Skipping account operations (demo mode - set POLYNOMIAL_API_KEY and WALLET_ADDRESS env vars for full functionality)

✅ Example completed successfully!

🔥 Advanced Example - Multiple Operations
Available markets: [ 'ETH', 'BTC', 'SOL', ... ]
⚠️  Skipping position lookup (demo mode)
Market Statistics: [ ... ]

🚨 Error Handling Example
Caught validation error: Invalid wallet address format

🎉 All examples completed!
```

## 🔗 Links

- [Polynomial Protocol](https://polynomial.fi)
- [polynomialfi on npm](https://www.npmjs.com/package/polynomialfi)
- [GitHub Repository](https://github.com/polynomial-protocol/polynomial-sdk)
