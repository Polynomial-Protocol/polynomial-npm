"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolynomialSDK = void 0;
const http_1 = require("./http");
const markets_1 = require("./markets");
const accounts_1 = require("./accounts");
const orders_1 = require("./orders");
const errors_1 = require("../errors");
const config_1 = require("../config");
const utils_1 = require("../utils");
/**
 * Main Polynomial SDK class
 */
class PolynomialSDK {
    constructor(config) {
        // Validate required configuration
        if (!config.apiKey) {
            throw new errors_1.ConfigurationError("API key is required", {
                providedConfig: { ...config, apiKey: "REDACTED" },
            });
        }
        if (!config.walletAddress) {
            throw new errors_1.ConfigurationError("Wallet address is required for SDK initialization", {
                providedConfig: {
                    ...config,
                    apiKey: "REDACTED",
                    sessionKey: "REDACTED",
                },
            });
        }
        if (!config.sessionKey) {
            throw new errors_1.ConfigurationError("Session key is required for SDK initialization", {
                providedConfig: {
                    ...config,
                    apiKey: "REDACTED",
                    sessionKey: "REDACTED",
                },
            });
        }
        // Validate wallet address format
        if (!(0, utils_1.isValidAddress)(config.walletAddress)) {
            throw new errors_1.ValidationError("Invalid wallet address format", {
                walletAddress: config.walletAddress,
            });
        }
        // Set up configuration with defaults first
        this.config = {
            chainId: config.chainId || 8008,
            apiEndpoint: config.apiEndpoint || config_1.NETWORKS.mainnet.apiEndpoint,
            orderbookEndpoint: config.orderbookEndpoint || config_1.NETWORKS.mainnet.orderbookEndpoint,
            relayerAddress: config.relayerAddress || config_1.NETWORKS.mainnet.relayerAddress,
            defaultSlippage: config.defaultSlippage || 10n,
            apiKey: config.apiKey,
            walletAddress: config.walletAddress,
            sessionKey: config.sessionKey,
        };
        // Store authentication credentials
        this.walletAddress = config.walletAddress;
        this.sessionKey = config.sessionKey;
        // Derive account ID from wallet address and chain ID
        this.accountId = (0, utils_1.deriveAccountId)(this.walletAddress, this.config.chainId);
        // Get network configuration
        const networkKey = Object.keys(config_1.NETWORKS).find((key) => config_1.NETWORKS[key].chainId === this.config.chainId);
        if (networkKey) {
            this.networkConfig = config_1.NETWORKS[networkKey];
        }
        else {
            // Create custom network config
            this.networkConfig = {
                chainId: this.config.chainId,
                apiEndpoint: this.config.apiEndpoint,
                orderbookEndpoint: this.config.orderbookEndpoint,
                relayerAddress: this.config.relayerAddress,
                perpFutures: config_1.NETWORKS.mainnet.perpFutures, // Use mainnet as default
            };
        }
        // Initialize HTTP clients
        this.httpClient = new http_1.HttpClient(this.config.apiEndpoint, this.config.apiKey);
        this.orderbookClient = new http_1.HttpClient(this.config.orderbookEndpoint, this.config.apiKey);
        // Initialize modules
        this.markets = new markets_1.Markets(this.httpClient, this.config.chainId);
        this.accounts = new accounts_1.Accounts(this.httpClient, this.config.chainId, this.walletAddress, () => this.getAccountId());
        this.orders = new orders_1.Orders(this.httpClient, this.orderbookClient, this.networkConfig, this.sessionKey, this.walletAddress, () => this.getAccountId());
    }
    /**
     * Gets the derived account ID
     */
    getAccountId() {
        return this.accountId;
    }
    /**
     * Creates a new SDK instance with the provided configuration
     */
    static create(config) {
        return new PolynomialSDK(config);
    }
    /**
     * Gets the current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Gets the network configuration
     */
    getNetworkConfig() {
        return { ...this.networkConfig };
    }
    /**
     * Updates the API key
     */
    updateApiKey(newApiKey) {
        if (!newApiKey) {
            throw new errors_1.ValidationError("API key cannot be empty");
        }
        this.httpClient.updateApiKey(newApiKey);
        this.orderbookClient.updateApiKey(newApiKey);
    }
    /**
     * Simple convenience method to create an order with minimal parameters
     * Only marketId and size are required, everything else uses sensible defaults
     * Uses the sessionKey and walletAddress provided during SDK initialization
     */
    async createOrder(marketId, size, options) {
        try {
            // Create the order using the Orders module with stored credentials (including account ID)
            return await this.orders.createOrder(marketId, size, options);
        }
        catch (error) {
            if (error instanceof errors_1.ValidationError) {
                throw error;
            }
            throw new errors_1.ValidationError(`Failed to create order: ${error instanceof Error ? error.message : "Unknown error"}`, { marketId, size: size.toString(), walletAddress: this.walletAddress });
        }
    }
    /**
     * Convenience method to get account summary with positions
     * Uses the walletAddress provided during SDK initialization
     */
    async getAccountSummary() {
        // Validate that wallet address is available
        if (!this.walletAddress) {
            throw new errors_1.ValidationError("Wallet address is required for account operations. Please provide walletAddress when creating the SDK instance.", { operation: "account_summary" });
        }
        return await this.accounts.getAccountSummary(this.walletAddress);
    }
    /**
     * Convenience method to get market data with statistics
     */
    async getMarketData(symbol) {
        if (symbol) {
            const market = await this.markets.getMarketBySymbol(symbol);
            if (!market) {
                return null;
            }
            return await this.markets.getMarketStats(market.marketId);
        }
        return await this.markets.getMarkets();
    }
}
exports.PolynomialSDK = PolynomialSDK;
//# sourceMappingURL=sdk.js.map