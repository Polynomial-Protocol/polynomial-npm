/**
 * Gets a timestamp representing one week from now.
 * Used for setting order expiration times.
 *
 * @returns Unix timestamp (in seconds) one week from the current time
 */
export declare function getWeekFromNowTimestamp(): number;
/**
 * Converts a human-readable decimal value to its big integer representation.
 *
 * @param value - The decimal value as a string or number
 * @param decimals - Number of decimal places (default: 18)
 * @returns BigInt representation
 */
export declare function parseUnits(value: string | number, decimals?: number): bigint;
/**
 * Converts a big integer value back to its human-readable decimal representation.
 *
 * @param value - The big integer value
 * @param decimals - Number of decimal places (default: 18)
 * @returns String representation of the decimal value
 */
export declare function formatUnits(value: bigint, decimals?: number): string;
/**
 * Calculates the acceptable price based on slippage tolerance.
 *
 * @param marketPrice - Current market price (in base units)
 * @param slippagePercentage - Slippage tolerance as a percentage (e.g., 1n for 1%)
 * @param isLong - Whether this is a long position
 * @returns Acceptable price adjusted for slippage
 */
export declare function calculateAcceptablePrice(marketPrice: bigint, slippagePercentage: bigint, isLong: boolean): bigint;
/**
 * Formats a price value for display purposes.
 *
 * @param price - Price in base units
 * @param decimals - Number of decimal places
 * @param displayDecimals - Number of decimals to show in output (default: 4)
 * @returns Formatted price string
 */
export declare function formatPrice(price: bigint | string, decimals?: number, displayDecimals?: number): string;
/**
 * Calculates the USD value of a position.
 *
 * @param size - Position size in base units
 * @param price - Price per unit
 * @param decimals - Number of decimal places
 * @returns USD value as a string
 */
export declare function calculatePositionValue(size: bigint, price: bigint, decimals?: number): string;
/**
 * Validates that a string is a valid Ethereum address.
 *
 * @param address - Address to validate
 * @returns True if valid Ethereum address
 */
export declare function isValidAddress(address: string): boolean;
/**
 * Validates that a string is a valid private key.
 *
 * @param privateKey - Private key to validate
 * @returns True if valid private key format
 */
export declare function isValidPrivateKey(privateKey: string): boolean;
/**
 * Generates a unique nonce for order submissions.
 *
 * @returns String representation of current timestamp in milliseconds
 */
export declare function generateNonce(): string;
/**
 * Converts a percentage to basis points.
 *
 * @param percentage - Percentage value (e.g., 1.5 for 1.5%)
 * @returns Basis points (e.g., 150 for 1.5%)
 */
export declare function percentageToBasisPoints(percentage: number): number;
/**
 * Converts basis points to percentage.
 *
 * @param basisPoints - Basis points value
 * @returns Percentage value
 */
export declare function basisPointsToPercentage(basisPoints: number): number;
//# sourceMappingURL=index.d.ts.map