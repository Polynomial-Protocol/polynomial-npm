import { AccountError, ValidationError } from "../errors";
import { isValidAddress } from "../utils";
/**
 * Accounts module for handling account management operations
 */
export class Accounts {
    constructor(httpClient, chainId, walletAddress, getAccountId) {
        this.httpClient = httpClient;
        this.chainId = chainId;
        this.walletAddress = walletAddress;
        this.getAccountId = getAccountId;
    }
    /**
     * Fetches account information for a given wallet address
     */
    async getAccount(walletAddress) {
        if (!isValidAddress(walletAddress)) {
            throw new ValidationError("Invalid wallet address format", {
                walletAddress,
            });
        }
        try {
            const response = await this.httpClient.get(`accounts?owner=${walletAddress}&ownershipType=SuperOwner&chainIds=${this.chainId}`);
            const account = response.find((item) => item.chainId === this.chainId);
            return account || null;
        }
        catch (error) {
            throw new AccountError(`Failed to fetch account for wallet ${walletAddress}: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress, chainId: this.chainId });
        }
    }
    /**
     * Gets all positions for a specific wallet address
     */
    async getPositionsForWallet(walletAddress) {
        try {
            const response = await this.httpClient.get(`positions/v2?owner=${walletAddress}&ownershipType=SuperOwner`);
            return response.positions || [];
        }
        catch (error) {
            throw new AccountError(`Failed to fetch positions for wallet ${walletAddress}: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress, chainId: this.chainId });
        }
    }
    /**
     * Gets a specific position by market ID
     */
    async getPositionByMarketForWallet(walletAddress, marketId) {
        try {
            const positions = await this.getPositionsForWallet(walletAddress);
            return (positions.find((position) => position.marketId === marketId) || null);
        }
        catch (error) {
            throw new AccountError(`Failed to fetch position for market ${marketId}: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress, marketId });
        }
    }
    /**
     * Gets account summary including positions and key metrics
     */
    async getAccountSummaryForWallet(walletAddress) {
        try {
            // Get account by wallet address
            const account = await this.getAccount(walletAddress);
            if (!account) {
                throw new AccountError(`Account not found for wallet: ${walletAddress}`, {
                    walletAddress,
                });
            }
            // Get positions using the wallet address
            const positions = await this.getPositionsForWallet(walletAddress);
            // Calculate totals
            const totalUnrealizedPnl = positions
                .reduce((sum, pos) => {
                return sum + parseFloat(pos.totalRealisedPnlUsd || "0");
            }, 0)
                .toFixed(2);
            const totalRealizedPnl = positions
                .reduce((sum, pos) => {
                return sum + parseFloat(pos.totalRealisedPnlUsd || "0");
            }, 0)
                .toFixed(2);
            return {
                account,
                positions,
                totalPositions: positions.length,
                totalUnrealizedPnl,
                totalRealizedPnl,
            };
        }
        catch (error) {
            if (error instanceof AccountError) {
                throw error;
            }
            throw new AccountError(`Failed to fetch account summary: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress });
        }
    }
    /**
     * Checks if an account exists for a given wallet address
     */
    async accountExists(walletAddress) {
        try {
            const account = await this.getAccount(walletAddress);
            return account !== null;
        }
        catch (error) {
            // If it's a validation error, re-throw it
            if (error instanceof ValidationError) {
                throw error;
            }
            // For other errors, return false
            return false;
        }
    }
    /**
     * Gets all accounts owned by a wallet address
     */
    async getAllAccountsForWallet(walletAddress) {
        if (!isValidAddress(walletAddress)) {
            throw new ValidationError("Invalid wallet address format", {
                walletAddress,
            });
        }
        try {
            const response = await this.httpClient.get(`accounts?owner=${walletAddress}&chainIds=${this.chainId}`);
            return response.filter((item) => item.chainId === this.chainId);
        }
        catch (error) {
            throw new AccountError(`Failed to fetch accounts for wallet ${walletAddress}: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress, chainId: this.chainId });
        }
    }
    /**
     * Gets all positions for the stored account using wallet address
     */
    async getPositions() {
        try {
            const response = await this.httpClient.get(`positions/v2?offset=0&limit=0&owner=${this.walletAddress}&ownershipType=SuperOwner&chainIds=${this.chainId}`);
            return response.positions || [];
        }
        catch (error) {
            throw new AccountError(`Failed to fetch positions for wallet ${this.walletAddress}: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress: this.walletAddress, chainId: this.chainId });
        }
    }
    /**
     * Gets a specific position by market ID for the stored account
     */
    async getPositionByMarket(marketId) {
        try {
            const positions = await this.getPositions();
            return (positions.find((position) => position.marketId === marketId) || null);
        }
        catch (error) {
            throw new AccountError(`Failed to fetch position for market ${marketId}: ${error instanceof Error ? error.message : "Unknown error"}`, { accountId: this.getAccountId(), marketId });
        }
    }
    /**
     * Gets account summary for the stored account
     */
    async getAccountSummary() {
        try {
            // Get account by wallet address (this still uses wallet address as it's the lookup key)
            const account = await this.getAccount(this.walletAddress);
            if (!account) {
                throw new AccountError(`Account not found for wallet: ${this.walletAddress}`, {
                    walletAddress: this.walletAddress,
                });
            }
            // Get positions using the derived account ID
            const positions = await this.getPositions();
            // Calculate totals
            const totalUnrealizedPnl = positions
                .reduce((sum, pos) => {
                const unrealizedPnl = parseFloat(pos.totalRealisedPnlUsd || "0");
                return sum + unrealizedPnl;
            }, 0)
                .toFixed(2);
            const totalRealizedPnl = positions
                .reduce((sum, pos) => {
                const realizedPnl = parseFloat(pos.totalRealisedPnlUsd || "0");
                return sum + realizedPnl;
            }, 0)
                .toFixed(2);
            return {
                account,
                positions,
                totalPositions: positions.length,
                totalUnrealizedPnl,
                totalRealizedPnl,
            };
        }
        catch (error) {
            if (error instanceof AccountError) {
                throw error;
            }
            throw new AccountError(`Failed to fetch account summary: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress: this.walletAddress, accountId: this.getAccountId() });
        }
    }
    /**
     * Gets margin information for a specific wallet address
     */
    async getMarginInfoForWallet(walletAddress) {
        if (!isValidAddress(walletAddress)) {
            throw new ValidationError("Invalid wallet address format", {
                walletAddress,
            });
        }
        try {
            const response = await this.httpClient.get(`margins/all-margins?owner=${walletAddress}&ownershipType=SuperOwner&chainIds=${this.chainId}`);
            console.log(JSON.stringify(response));
            const marginData = response.find((item) => item.chainId === this.chainId);
            if (!marginData) {
                throw new AccountError(`No margin information found for wallet ${walletAddress} on chain ${this.chainId}`, { walletAddress, chainId: this.chainId });
            }
            return {
                availableMargin: marginData.availableMargin,
                requiredMaintenanceMargin: marginData.requiredMaintenanceMargin,
            };
        }
        catch (error) {
            throw new AccountError(`Failed to fetch margin information for wallet ${walletAddress}: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress, chainId: this.chainId });
        }
    }
    /**
     * Gets margin information for the stored account
     */
    async getMarginInfo() {
        return this.getMarginInfoForWallet(this.walletAddress);
    }
    /**
     * Gets maximum possible trade sizes for a specific market and account
     */
    async getMaxPossibleTradeSizesForWallet(walletAddress, marketId) {
        if (!isValidAddress(walletAddress)) {
            throw new ValidationError("Invalid wallet address format", {
                walletAddress,
            });
        }
        try {
            // First get the account to retrieve the accountId
            const account = await this.getAccount(walletAddress);
            if (!account) {
                throw new AccountError(`Account not found for wallet ${walletAddress}`, { walletAddress, chainId: this.chainId });
            }
            const requestPayload = {
                accountId: account.accountId,
                chainId: this.chainId,
                marketId: marketId,
                addedCollaterals: [],
            };
            const response = await this.httpClient.post("margins/max-possible-trade-sizes", requestPayload);
            return response;
        }
        catch (error) {
            throw new AccountError(`Failed to fetch max possible trade sizes for market ${marketId}: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress, marketId, chainId: this.chainId });
        }
    }
    /**
     * Gets maximum possible trade sizes for a specific market using the stored account
     */
    async getMaxPossibleTradeSizes(marketId) {
        return this.getMaxPossibleTradeSizesForWallet(this.walletAddress, marketId);
    }
}
//# sourceMappingURL=accounts.js.map