# Polynomial Trade – Example Integration

This is a basic TypeScript example showing how to interact with the **Polynomial Perpetuals** platform.  
It includes simple functions to fetch market/account data and place a market order using **Nitro Mode API** with session key signing.

---

## ⚙️ What’s Included

- Fetch market and account info
- Simulate post-order details
- Sign and place a Nitro Mode market order
- Minimal error handling and structure for quick experimentation

---

## 🧪 Getting Started

Clone the repo and install dependencies:

```bash
npm install
```

Replace placeholder values like SESSION_KEY and WALLET_ADDRESS in the example scripts.

Run the main example:

```bash
npm run dev
```

## 🔐 Notes

- This is not production-ready.
- Session keys are used directly in code for simplicity.
- Order signing uses EIP-712 and viem’s wallet utilities.
- For more details on the API, refer to [API Documentation](https://docs.polynomial.fi).
- For queries, issues or feature requests, please open a ticket on the [Discord](https://discord.com/channels/843170059006640179/986580658015076353).
