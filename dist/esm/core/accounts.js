import { AccountError, ValidationError } from "../errors";
import { isValidAddress } from "../utils";
/**
 * Accounts module for handling account management operations
 */
export class Accounts {
    constructor(httpClient, chainId) {
        this.httpClient = httpClient;
        this.chainId = chainId;
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
    async getPositions(walletAddress) {
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
    async getPositionByMarket(walletAddress, marketId) {
        try {
            const positions = await this.getPositions(walletAddress);
            return (positions.find((position) => position.marketId === marketId) || null);
        }
        catch (error) {
            throw new AccountError(`Failed to fetch position for market ${marketId}: ${error instanceof Error ? error.message : "Unknown error"}`, { walletAddress, marketId });
        }
    }
    /**
     * Gets account summary including positions and key metrics
     */
    async getAccountSummary(walletAddress) {
        try {
            // Get account by wallet address
            const account = await this.getAccount(walletAddress);
            if (!account) {
                throw new AccountError(`Account not found for wallet: ${walletAddress}`, {
                    walletAddress,
                });
            }
            // Get positions using the wallet address
            const positions = await this.getPositions(walletAddress);
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
}
//# sourceMappingURL=accounts.js.map