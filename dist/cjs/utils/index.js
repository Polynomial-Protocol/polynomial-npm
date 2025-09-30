"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekFromNowTimestamp = getWeekFromNowTimestamp;
exports.parseUnits = parseUnits;
exports.formatUnits = formatUnits;
exports.calculateAcceptablePrice = calculateAcceptablePrice;
exports.formatPrice = formatPrice;
exports.calculatePositionValue = calculatePositionValue;
exports.isValidAddress = isValidAddress;
exports.isValidPrivateKey = isValidPrivateKey;
exports.generateNonce = generateNonce;
exports.percentageToBasisPoints = percentageToBasisPoints;
exports.basisPointsToPercentage = basisPointsToPercentage;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const config_1 = require("../config");
/**
 * Gets a timestamp representing one week from now.
 * Used for setting order expiration times.
 *
 * @returns Unix timestamp (in seconds) one week from the current time
 */
function getWeekFromNowTimestamp() {
    const oneWeekInSeconds = 7 * 24 * 60 * 60; // 7 days * 24 hours * 60 minutes * 60 seconds
    return Math.floor(Date.now() / 1000) + oneWeekInSeconds;
}
/**
 * Converts a human-readable decimal value to its big integer representation.
 *
 * @param value - The decimal value as a string or number
 * @param decimals - Number of decimal places (default: 18)
 * @returns BigInt representation
 */
function parseUnits(value, decimals = config_1.DECIMALS) {
    const bn = new bignumber_js_1.default(value);
    const multiplier = new bignumber_js_1.default(10).pow(decimals);
    return BigInt(bn.multipliedBy(multiplier).toFixed(0));
}
/**
 * Converts a big integer value back to its human-readable decimal representation.
 *
 * @param value - The big integer value
 * @param decimals - Number of decimal places (default: 18)
 * @returns String representation of the decimal value
 */
function formatUnits(value, decimals = config_1.DECIMALS) {
    const bn = new bignumber_js_1.default(value.toString());
    const divisor = new bignumber_js_1.default(10).pow(decimals);
    return bn.dividedBy(divisor).toFixed();
}
/**
 * Calculates the acceptable price based on slippage tolerance.
 *
 * @param marketPrice - Current market price (in base units)
 * @param slippagePercentage - Slippage tolerance as a percentage (e.g., 1n for 1%)
 * @param isLong - Whether this is a long position
 * @returns Acceptable price adjusted for slippage
 */
function calculateAcceptablePrice(marketPrice, slippagePercentage, isLong) {
    const slippageMultiplier = isLong
        ? 100n + slippagePercentage
        : 100n - slippagePercentage;
    return (marketPrice * slippageMultiplier) / 100n;
}
/**
 * Formats a price value for display purposes.
 *
 * @param price - Price in base units
 * @param decimals - Number of decimal places
 * @param displayDecimals - Number of decimals to show in output (default: 4)
 * @returns Formatted price string
 */
function formatPrice(price, decimals = config_1.DECIMALS, displayDecimals = 4) {
    const priceValue = typeof price === "string" ? BigInt(price) : price;
    const formatted = formatUnits(priceValue, decimals);
    return new bignumber_js_1.default(formatted).toFixed(displayDecimals);
}
/**
 * Calculates the USD value of a position.
 *
 * @param size - Position size in base units
 * @param price - Price per unit
 * @param decimals - Number of decimal places
 * @returns USD value as a string
 */
function calculatePositionValue(size, price, decimals = config_1.DECIMALS) {
    const sizeFormatted = formatUnits(size, decimals);
    const priceFormatted = formatUnits(price, decimals);
    return new bignumber_js_1.default(sizeFormatted).multipliedBy(priceFormatted).toFixed(2);
}
/**
 * Validates that a string is a valid Ethereum address.
 *
 * @param address - Address to validate
 * @returns True if valid Ethereum address
 */
function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
/**
 * Validates that a string is a valid private key.
 *
 * @param privateKey - Private key to validate
 * @returns True if valid private key format
 */
function isValidPrivateKey(privateKey) {
    return /^0x[a-fA-F0-9]{64}$/.test(privateKey);
}
/**
 * Generates a unique nonce for order submissions.
 *
 * @returns String representation of current timestamp in milliseconds
 */
function generateNonce() {
    return Date.now().toString();
}
/**
 * Converts a percentage to basis points.
 *
 * @param percentage - Percentage value (e.g., 1.5 for 1.5%)
 * @returns Basis points (e.g., 150 for 1.5%)
 */
function percentageToBasisPoints(percentage) {
    return Math.round(percentage * 100);
}
/**
 * Converts basis points to percentage.
 *
 * @param basisPoints - Basis points value
 * @returns Percentage value
 */
function basisPointsToPercentage(basisPoints) {
    return basisPoints / 100;
}
//# sourceMappingURL=index.js.map