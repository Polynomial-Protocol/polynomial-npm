import { HttpClient } from "./http";
import { AccountError, ValidationError } from "../errors";
import {
  IAccountAPIResponse,
  IPositionDataReceived,
  IPosition,
} from "../types";
import { isValidAddress } from "../utils";

/**
 * Accounts module for handling account management operations
 */
export class Accounts {
  private readonly httpClient: HttpClient;
  private readonly chainId: number;

  constructor(httpClient: HttpClient, chainId: number) {
    this.httpClient = httpClient;
    this.chainId = chainId;
  }

  /**
   * Fetches account information for a given wallet address
   */
  async getAccount(walletAddress: string): Promise<IAccountAPIResponse | null> {
    if (!isValidAddress(walletAddress)) {
      throw new ValidationError("Invalid wallet address format", {
        walletAddress,
      });
    }

    try {
      const response = await this.httpClient.get<IAccountAPIResponse[]>(
        `accounts?owner=${walletAddress}&ownershipType=SuperOwner&chainIds=${this.chainId}`
      );

      const account = response.find((item) => item.chainId === this.chainId);
      return account || null;
    } catch (error) {
      throw new AccountError(
        `Failed to fetch account for wallet ${walletAddress}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { walletAddress, chainId: this.chainId }
      );
    }
  }

  /**
   * Gets all positions for a specific account
   */
  async getPositions(accountId: string): Promise<IPosition[]> {
    try {
      const response = await this.httpClient.get<IPositionDataReceived>(
        `positions/v2?accountId=${accountId}&chainId=${this.chainId}`
      );

      return response.positions || [];
    } catch (error) {
      throw new AccountError(
        `Failed to fetch positions for account ${accountId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { accountId, chainId: this.chainId }
      );
    }
  }

  /**
   * Gets a specific position by market ID
   */
  async getPositionByMarket(
    accountId: string,
    marketId: string
  ): Promise<IPosition | null> {
    try {
      const positions = await this.getPositions(accountId);
      return (
        positions.find((position) => position.marketId === marketId) || null
      );
    } catch (error) {
      throw new AccountError(
        `Failed to fetch position for market ${marketId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { accountId, marketId }
      );
    }
  }

  /**
   * Gets account summary including positions and key metrics
   */
  async getAccountSummary(walletAddress: string): Promise<{
    account: IAccountAPIResponse;
    positions: IPosition[];
    totalPositions: number;
    totalUnrealizedPnl: string;
    totalRealizedPnl: string;
  }> {
    try {
      // Get account by wallet address
      const account = await this.getAccount(walletAddress);

      if (!account) {
        throw new AccountError(
          `Account not found for wallet: ${walletAddress}`,
          {
            walletAddress,
          }
        );
      }

      // Get positions using the account ID
      const positions = await this.getPositions(account.accountId);

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
    } catch (error) {
      if (error instanceof AccountError) {
        throw error;
      }
      throw new AccountError(
        `Failed to fetch account summary: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { walletAddress }
      );
    }
  }

  /**
   * Checks if an account exists for a given wallet address
   */
  async accountExists(walletAddress: string): Promise<boolean> {
    try {
      const account = await this.getAccount(walletAddress);
      return account !== null;
    } catch (error) {
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
  async getAllAccountsForWallet(
    walletAddress: string
  ): Promise<IAccountAPIResponse[]> {
    if (!isValidAddress(walletAddress)) {
      throw new ValidationError("Invalid wallet address format", {
        walletAddress,
      });
    }

    try {
      const response = await this.httpClient.get<IAccountAPIResponse[]>(
        `accounts?owner=${walletAddress}&chainIds=${this.chainId}`
      );

      return response.filter((item) => item.chainId === this.chainId);
    } catch (error) {
      throw new AccountError(
        `Failed to fetch accounts for wallet ${walletAddress}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { walletAddress, chainId: this.chainId }
      );
    }
  }
}
