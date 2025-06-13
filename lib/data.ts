import { API_ENDPOINT } from "./config";

/**
 * Makes a GET request to the specified path under the base API endpoint.
 *
 * @param path - Relative API path (e.g., 'accounts?owner=...')
 * @returns JSON-parsed response
 */
export const get = async (path: string, x_api_key: string): Promise<any> => {
    return await fetch(`${API_ENDPOINT}/${path}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': x_api_key, // Include the X-API-Key for authentication
        },
    });
};

/**
 * Makes a POST request to the specified path with a JSON payload.
 *
 * @param path - Relative API path (e.g., 'orders/place')
 * @param data - Request body to be sent as JSON
 * @returns JSON-parsed response
 */
export const post = async (path: string, data: any, x_api_key: string): Promise<any> => {
    return await fetch(`${API_ENDPOINT}/${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': x_api_key, // Include the X-API-Key for authentication
        },
        body: JSON.stringify(data),
    });
};
