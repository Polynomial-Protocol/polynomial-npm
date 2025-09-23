import { APIError, NetworkError, createAPIError } from "../errors";

/**
 * HTTP client for making API requests to Polynomial endpoints
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.apiKey = apiKey;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": apiKey,
    };
  }

  /**
   * Makes a GET request to the specified path
   */
  async get<T = any>(
    path: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("GET", path, undefined, headers);
  }

  /**
   * Makes a POST request to the specified path with data
   */
  async post<T = any>(
    path: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("POST", path, data, headers);
  }

  /**
   * Makes a PUT request to the specified path with data
   */
  async put<T = any>(
    path: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("PUT", path, data, headers);
  }

  /**
   * Makes a DELETE request to the specified path
   */
  async delete<T = any>(
    path: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("DELETE", path, undefined, headers);
  }

  /**
   * Generic request method that handles all HTTP operations
   */
  private async request<T>(
    method: string,
    path: string,
    data?: any,
    additionalHeaders?: Record<string, string>
  ): Promise<T> {
    const url = `${this.baseUrl}/${path.replace(/^\//, "")}`;

    const headers = {
      ...this.defaultHeaders,
      ...additionalHeaders,
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && (method === "POST" || method === "PUT")) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      // Handle different response types
      let responseData: any;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        throw createAPIError(response, responseData);
      }

      return responseData;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new NetworkError(`Network error: Unable to connect to ${url}`, {
          url,
          method,
          originalError: error.message,
        });
      }

      // Handle other errors
      throw new NetworkError(
        `Request failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { url, method, originalError: error }
      );
    }
  }

  /**
   * Updates the API key for future requests
   */
  updateApiKey(newApiKey: string): void {
    this.defaultHeaders["x-api-key"] = newApiKey;
  }

  /**
   * Gets the current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}
