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
        // Set up configuration with defaults
        this.config = {
            chainId: config.chainId || 8008,
            apiEndpoint: config.apiEndpoint || config_1.NETWORKS.mainnet.apiEndpoint,
            orderbookEndpoint: config.orderbookEndpoint || config_1.NETWORKS.mainnet.orderbookEndpoint,
            relayerAddress: config.relayerAddress || config_1.NETWORKS.mainnet.relayerAddress,
            defaultSlippage: config.defaultSlippage || 10n,
            apiKey: config.apiKey,
        };
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
        this.accounts = new accounts_1.Accounts(this.httpClient, this.config.chainId);
        this.orders = new orders_1.Orders(this.httpClient, this.orderbookClient, this.networkConfig);
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
     * Convenience method to create a market order with trade simulation
     */
    async createMarketOrderWithSimulation(sessionKey, walletAddress, marketSymbol, size, isLong, maxSlippage) {
        // Validate inputs
        if (!(0, utils_1.isValidAddress)(walletAddress)) {
            throw new errors_1.ValidationError("Invalid wallet address format", {
                walletAddress,
            });
        }
        try {
            // Get account
            const account = await this.accounts.getAccount(walletAddress);
            if (!account) {
                throw new errors_1.ValidationError(`No account found for wallet address: ${walletAddress}`, { walletAddress });
            }
            // Get market
            const market = await this.markets.getMarketBySymbol(marketSymbol);
            if (!market) {
                throw new errors_1.ValidationError(`Market not found for symbol: ${marketSymbol}`, { marketSymbol });
            }
            // Simulate the trade
            const simulation = await this.markets.simulateTrade({
                accountId: account.accountId,
                marketId: market.marketId,
                sizeDelta: isLong ? size : -size,
            });
            // Check if trade is feasible
            if (!simulation.feasible) {
                throw new errors_1.ValidationError(`Trade not feasible: ${simulation.errorMsg || "Unknown reason"}`, { simulation });
            }
            // Calculate acceptable price with slippage
            const fillPrice = BigInt(simulation.fillPrice);
            const slippage = maxSlippage || this.config.defaultSlippage;
            const acceptablePrice = this.orders.calculateAcceptablePriceWithSlippage(fillPrice, slippage, isLong);
            // Create the order
            const orderResult = await this.orders.createMarketOrder(sessionKey, walletAddress, account.accountId, {
                marketId: market.marketId,
                size,
                isLong,
                acceptablePrice,
            });
            return {
                simulation,
                orderResult,
            };
        }
        catch (error) {
            if (error instanceof errors_1.ValidationError) {
                throw error;
            }
            throw new errors_1.ValidationError(`Failed to create market order with simulation: ${error instanceof Error ? error.message : "Unknown error"}`, { marketSymbol, size: size.toString(), isLong });
        }
    }
    /**
     * Convenience method to get account summary with positions
     */
    async getAccountSummary(walletAddress) {
        if (!(0, utils_1.isValidAddress)(walletAddress)) {
            throw new errors_1.ValidationError("Invalid wallet address format", {
                walletAddress,
            });
        }
        const account = await this.accounts.getAccount(walletAddress);
        if (!account) {
            throw new errors_1.ValidationError(`No account found for wallet address: ${walletAddress}`, { walletAddress });
        }
        return await this.accounts.getAccountSummary(account.accountId);
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