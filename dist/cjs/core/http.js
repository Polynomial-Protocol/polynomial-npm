"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const errors_1 = require("../errors");
/**
 * HTTP client for making API requests to Polynomial endpoints
 */
class HttpClient {
    constructor(baseUrl, apiKey) {
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
    async get(path, headers) {
        return this.request("GET", path, undefined, headers);
    }
    /**
     * Makes a POST request to the specified path with data
     */
    async post(path, data, headers) {
        return this.request("POST", path, data, headers);
    }
    /**
     * Makes a PUT request to the specified path with data
     */
    async put(path, data, headers) {
        return this.request("PUT", path, data, headers);
    }
    /**
     * Makes a DELETE request to the specified path
     */
    async delete(path, headers) {
        return this.request("DELETE", path, undefined, headers);
    }
    /**
     * Generic request method that handles all HTTP operations
     */
    async request(method, path, data, additionalHeaders) {
        const url = `${this.baseUrl}/${path.replace(/^\//, "")}`;
        const headers = {
            ...this.defaultHeaders,
            ...additionalHeaders,
        };
        const config = {
            method,
            headers,
        };
        if (data && (method === "POST" || method === "PUT")) {
            config.body = JSON.stringify(data);
        }
        try {
            const response = await fetch(url, config);
            // Handle different response types
            let responseData;
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) {
                responseData = await response.json();
            }
            else {
                responseData = await response.text();
            }
            if (!response.ok) {
                throw (0, errors_1.createAPIError)(response, responseData);
            }
            return responseData;
        }
        catch (error) {
            if (error instanceof errors_1.APIError) {
                throw error;
            }
            // Handle network errors
            if (error instanceof TypeError && error.message.includes("fetch")) {
                throw new errors_1.NetworkError(`Network error: Unable to connect to ${url}`, {
                    url,
                    method,
                    originalError: error.message,
                });
            }
            // Handle other errors
            throw new errors_1.NetworkError(`Request failed: ${error instanceof Error ? error.message : "Unknown error"}`, { url, method, originalError: error });
        }
    }
    /**
     * Updates the API key for future requests
     */
    updateApiKey(newApiKey) {
        this.defaultHeaders["x-api-key"] = newApiKey;
    }
    /**
     * Gets the current base URL
     */
    getBaseUrl() {
        return this.baseUrl;
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=http.js.map