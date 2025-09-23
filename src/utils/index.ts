import BigNumber from "bignumber.js";
import { DECIMALS } from "../config";

/**
 * Gets a timestamp representing one week from now.
 * Used for setting order expiration times.
 *
 * @returns Unix timestamp (in seconds) one week from the current time
 */
export function getWeekFromNowTimestamp(): number {
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
export function parseUnits(
  value: string | number,
  decimals: number = DECIMALS
): bigint {
  const bn = new BigNumber(value);
  const multiplier = new BigNumber(10).pow(decimals);
  return BigInt(bn.multipliedBy(multiplier).toFixed(0));
}

/**
 * Converts a big integer value back to its human-readable decimal representation.
 *
 * @param value - The big integer value
 * @param decimals - Number of decimal places (default: 18)
 * @returns String representation of the decimal value
 */
export function formatUnits(
  value: bigint,
  decimals: number = DECIMALS
): string {
  const bn = new BigNumber(value.toString());
  const divisor = new BigNumber(10).pow(decimals);
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
export function calculateAcceptablePrice(
  marketPrice: bigint,
  slippagePercentage: bigint,
  isLong: boolean
): bigint {
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
export function formatPrice(
  price: bigint | string,
  decimals: number = DECIMALS,
  displayDecimals: number = 4
): string {
  const priceValue = typeof price === "string" ? BigInt(price) : price;
  const formatted = formatUnits(priceValue, decimals);
  return new BigNumber(formatted).toFixed(displayDecimals);
}

/**
 * Calculates the USD value of a position.
 *
 * @param size - Position size in base units
 * @param price - Price per unit
 * @param decimals - Number of decimal places
 * @returns USD value as a string
 */
export function calculatePositionValue(
  size: bigint,
  price: bigint,
  decimals: number = DECIMALS
): string {
  const sizeFormatted = formatUnits(size, decimals);
  const priceFormatted = formatUnits(price, decimals);

  return new BigNumber(sizeFormatted).multipliedBy(priceFormatted).toFixed(2);
}

/**
 * Validates that a string is a valid Ethereum address.
 *
 * @param address - Address to validate
 * @returns True if valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates that a string is a valid private key.
 *
 * @param privateKey - Private key to validate
 * @returns True if valid private key format
 */
export function isValidPrivateKey(privateKey: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(privateKey);
}

/**
 * Generates a unique nonce for order submissions.
 *
 * @returns String representation of current timestamp in milliseconds
 */
export function generateNonce(): string {
  return Date.now().toString();
}

/**
 * Converts a percentage to basis points.
 *
 * @param percentage - Percentage value (e.g., 1.5 for 1.5%)
 * @returns Basis points (e.g., 150 for 1.5%)
 */
export function percentageToBasisPoints(percentage: number): number {
  return Math.round(percentage * 100);
}

/**
 * Converts basis points to percentage.
 *
 * @param basisPoints - Basis points value
 * @returns Percentage value
 */
export function basisPointsToPercentage(basisPoints: number): number {
  return basisPoints / 100;
}
