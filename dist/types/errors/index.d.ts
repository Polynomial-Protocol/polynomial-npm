/**
 * Base error class for all SDK errors
 */
export declare class PolynomialSDKError extends Error {
    readonly code: string;
    readonly context?: Record<string, any>;
    constructor(message: string, code: string, context?: Record<string, any>);
}
/**
 * Error thrown when API requests fail
 */
export declare class APIError extends PolynomialSDKError {
    readonly status: number;
    readonly response?: any;
    constructor(message: string, status: number, response?: any, context?: Record<string, any>);
}
/**
 * Error thrown when configuration is invalid
 */
export declare class ConfigurationError extends PolynomialSDKError {
    constructor(message: string, context?: Record<string, any>);
}
/**
 * Error thrown when validation fails
 */
export declare class ValidationError extends PolynomialSDKError {
    constructor(message: string, context?: Record<string, any>);
}
/**
 * Error thrown when order operations fail
 */
export declare class OrderError extends PolynomialSDKError {
    constructor(message: string, context?: Record<string, any>);
}
/**
 * Error thrown when account operations fail
 */
export declare class AccountError extends PolynomialSDKError {
    constructor(message: string, context?: Record<string, any>);
}
/**
 * Error thrown when market operations fail
 */
export declare class MarketError extends PolynomialSDKError {
    constructor(message: string, context?: Record<string, any>);
}
/**
 * Error thrown when network operations fail
 */
export declare class NetworkError extends PolynomialSDKError {
    constructor(message: string, context?: Record<string, any>);
}
/**
 * Error thrown when signing operations fail
 */
export declare class SigningError extends PolynomialSDKError {
    constructor(message: string, context?: Record<string, any>);
}
/**
 * Helper function to create appropriate error from API response
 */
export declare function createAPIError(response: Response, responseData?: any): APIError;
/**
 * Type guard to check if error is a PolynomialSDKError
 */
export declare function isPolynomialSDKError(error: unknown): error is PolynomialSDKError;
/**
 * Type guard to check if error is an APIError
 */
export declare function isAPIError(error: unknown): error is APIError;
//# sourceMappingURL=index.d.ts.map