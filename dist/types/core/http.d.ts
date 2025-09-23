/**
 * HTTP client for making API requests to Polynomial endpoints
 */
export declare class HttpClient {
    private readonly baseUrl;
    private readonly apiKey;
    private readonly defaultHeaders;
    constructor(baseUrl: string, apiKey: string);
    /**
     * Makes a GET request to the specified path
     */
    get<T = any>(path: string, headers?: Record<string, string>): Promise<T>;
    /**
     * Makes a POST request to the specified path with data
     */
    post<T = any>(path: string, data?: any, headers?: Record<string, string>): Promise<T>;
    /**
     * Makes a PUT request to the specified path with data
     */
    put<T = any>(path: string, data?: any, headers?: Record<string, string>): Promise<T>;
    /**
     * Makes a DELETE request to the specified path
     */
    delete<T = any>(path: string, headers?: Record<string, string>): Promise<T>;
    /**
     * Generic request method that handles all HTTP operations
     */
    private request;
    /**
     * Updates the API key for future requests
     */
    updateApiKey(newApiKey: string): void;
    /**
     * Gets the current base URL
     */
    getBaseUrl(): string;
}
//# sourceMappingURL=http.d.ts.map