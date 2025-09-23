/**
 * Base error class for all SDK errors
 */
export class PolynomialSDKError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, any>;

  constructor(message: string, code: string, context?: Record<string, any>) {
    super(message);
    this.name = "PolynomialSDKError";
    this.code = code;
    this.context = context;
  }
}

/**
 * Error thrown when API requests fail
 */
export class APIError extends PolynomialSDKError {
  public readonly status: number;
  public readonly response?: any;

  constructor(
    message: string,
    status: number,
    response?: any,
    context?: Record<string, any>
  ) {
    super(message, "API_ERROR", context);
    this.name = "APIError";
    this.status = status;
    this.response = response;
  }
}

/**
 * Error thrown when configuration is invalid
 */
export class ConfigurationError extends PolynomialSDKError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "CONFIGURATION_ERROR", context);
    this.name = "ConfigurationError";
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends PolynomialSDKError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", context);
    this.name = "ValidationError";
  }
}

/**
 * Error thrown when order operations fail
 */
export class OrderError extends PolynomialSDKError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "ORDER_ERROR", context);
    this.name = "OrderError";
  }
}

/**
 * Error thrown when account operations fail
 */
export class AccountError extends PolynomialSDKError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "ACCOUNT_ERROR", context);
    this.name = "AccountError";
  }
}

/**
 * Error thrown when market operations fail
 */
export class MarketError extends PolynomialSDKError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "MARKET_ERROR", context);
    this.name = "MarketError";
  }
}

/**
 * Error thrown when network operations fail
 */
export class NetworkError extends PolynomialSDKError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "NETWORK_ERROR", context);
    this.name = "NetworkError";
  }
}

/**
 * Error thrown when signing operations fail
 */
export class SigningError extends PolynomialSDKError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "SIGNING_ERROR", context);
    this.name = "SigningError";
  }
}

/**
 * Helper function to create appropriate error from API response
 */
export function createAPIError(
  response: Response,
  responseData?: any
): APIError {
  const message =
    responseData?.message ||
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
export function isPolynomialSDKError(
  error: unknown
): error is PolynomialSDKError {
  return error instanceof PolynomialSDKError;
}

/**
 * Type guard to check if error is an APIError
 */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}
