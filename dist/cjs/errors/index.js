"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigningError = exports.NetworkError = exports.MarketError = exports.AccountError = exports.OrderError = exports.ValidationError = exports.ConfigurationError = exports.APIError = exports.PolynomialSDKError = void 0;
exports.createAPIError = createAPIError;
exports.isPolynomialSDKError = isPolynomialSDKError;
exports.isAPIError = isAPIError;
/**
 * Base error class for all SDK errors
 */
class PolynomialSDKError extends Error {
    constructor(message, code, context) {
        super(message);
        this.name = "PolynomialSDKError";
        this.code = code;
        this.context = context;
    }
}
exports.PolynomialSDKError = PolynomialSDKError;
/**
 * Error thrown when API requests fail
 */
class APIError extends PolynomialSDKError {
    constructor(message, status, response, context) {
        super(message, "API_ERROR", context);
        this.name = "APIError";
        this.status = status;
        this.response = response;
    }
}
exports.APIError = APIError;
/**
 * Error thrown when configuration is invalid
 */
class ConfigurationError extends PolynomialSDKError {
    constructor(message, context) {
        super(message, "CONFIGURATION_ERROR", context);
        this.name = "ConfigurationError";
    }
}
exports.ConfigurationError = ConfigurationError;
/**
 * Error thrown when validation fails
 */
class ValidationError extends PolynomialSDKError {
    constructor(message, context) {
        super(message, "VALIDATION_ERROR", context);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
/**
 * Error thrown when order operations fail
 */
class OrderError extends PolynomialSDKError {
    constructor(message, context) {
        super(message, "ORDER_ERROR", context);
        this.name = "OrderError";
    }
}
exports.OrderError = OrderError;
/**
 * Error thrown when account operations fail
 */
class AccountError extends PolynomialSDKError {
    constructor(message, context) {
        super(message, "ACCOUNT_ERROR", context);
        this.name = "AccountError";
    }
}
exports.AccountError = AccountError;
/**
 * Error thrown when market operations fail
 */
class MarketError extends PolynomialSDKError {
    constructor(message, context) {
        super(message, "MARKET_ERROR", context);
        this.name = "MarketError";
    }
}
exports.MarketError = MarketError;
/**
 * Error thrown when network operations fail
 */
class NetworkError extends PolynomialSDKError {
    constructor(message, context) {
        super(message, "NETWORK_ERROR", context);
        this.name = "NetworkError";
    }
}
exports.NetworkError = NetworkError;
/**
 * Error thrown when signing operations fail
 */
class SigningError extends PolynomialSDKError {
    constructor(message, context) {
        super(message, "SIGNING_ERROR", context);
        this.name = "SigningError";
    }
}
exports.SigningError = SigningError;
/**
 * Helper function to create appropriate error from API response
 */
function createAPIError(response, responseData) {
    const message = responseData?.message ||
        responseData?.error ||
        response.statusText ||
        "Unknown API error";
    return new APIError(message, response.status, responseData, {
        url: response.url,
        method: "GET/POST", // This could be enhanced to track actual method
    });
}
/**
 * Type guard to check if error is a PolynomialSDKError
 */
function isPolynomialSDKError(error) {
    return error instanceof PolynomialSDKError;
}
/**
 * Type guard to check if error is an APIError
 */
function isAPIError(error) {
    return error instanceof APIError;
}
//# sourceMappingURL=index.js.map