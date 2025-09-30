# Polynomial SDK Examples

This directory contains example usage of the **polynomialfi** npm package.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:

```bash
# Your Polynomial API key
API_KEY=your_actual_api_key_here

# Your session key for signing orders
SESSION_KEY=your_actual_session_key_here

# Your wallet address
WALLET_ADDRESS=your_actual_wallet_address_here

# Chain ID (8008 for Polynomial mainnet)
CHAIN_ID=8008
```

**⚠️ Important**: Never commit your `.env` file to version control. It contains sensitive credentials.

### 3. Run the Examples

```bash
npm start
# or
npx ts-node -P ./tsconfig.json basic-usage.ts
```

### 4. Development Mode (with auto-reload)

```bash
npm run dev
```

## 📋 What the Examples Demonstrate

The example scripts showcase:

- ✅ **SDK Initialization** - Setting up the Polynomial SDK
- ✅ **Market Data** - Fetching available markets and prices
- ✅ **Account Management** - Getting account information and positions
- ✅ **Order Creation** - Creating and signing market orders
- ✅ **Error Handling** - Proper error handling patterns

## 📁 Files

- `basic-usage.ts` - TypeScript example demonstrating SDK usage
- `.env.example` - Example environment configuration file
- `.env` - Your actual environment configuration (not tracked in git)
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
