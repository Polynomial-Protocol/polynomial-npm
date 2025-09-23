"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NETWORKS = exports.DECIMALS = exports.DEFAULT_SLIPPAGE_PERCENTAGE = exports.PERP_FUTURES = exports.ZERO_HEX_32 = exports.RELAYER_ADDRESS = exports.CHAIN_ID = exports.API_ORDERBOOK_ENDPOINT = exports.API_ENDPOINT = void 0;
// Base API endpoint for general trading and account operations
exports.API_ENDPOINT = "https://perps-api-mainnet.polynomial.finance";
// Endpoint for orderbook-related operations (used in Nitro Mode)
exports.API_ORDERBOOK_ENDPOINT = "https://orderbook-mainnet.polynomial.finance/api";
// Chain ID for the supported L2 / EVM-compatible network (e.g., Polynomial chain)
exports.CHAIN_ID = 8008;
// Address of the relayer contract (used in non-contract calls like Nitro Mode)
exports.RELAYER_ADDRESS = "0x4D387f5c0Ec87e47b9Df9b8C97B89D2977431b27";
// Constant representing a zeroed 32-byte hex string
exports.ZERO_HEX_32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
// EIP-712 typed data domain for signing orders and trades
exports.PERP_FUTURES = {
    name: "PolynomialPerpetualFutures",
    version: "1",
    address: "0xD052Fa8b2af8Ed81C764D5d81cCf2725B2148688",
};
// Default allowed slippage percentage for market orders (as bigint)
exports.DEFAULT_SLIPPAGE_PERCENTAGE = 10n;
// Default decimal precision used in token/margin calculations (18 decimals for ETH-like assets)
exports.DECIMALS = 18;
/**
 * Predefined network configurations
 */
exports.NETWORKS = {
    mainnet: {
        chainId: 8008,
        apiEndpoint: "https://perps-api-mainnet.polynomial.finance",
        orderbookEndpoint: "https://orderbook-mainnet.polynomial.finance/api",
        relayerAddress: "0x4D387f5c0Ec87e47b9Df9b8C97B89D2977431b27",
        perpFutures: {
            name: "PolynomialPerpetualFutures",
            version: "1",
            address: "0xD052Fa8b2af8Ed81C764D5d81cCf2725B2148688",
        },
    },
};
//# sourceMappingURL=index.js.map