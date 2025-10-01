import { HttpClient } from "./http";
import {
  PostTradeDetailsRequest,
  PostTradeDetailsLimitRequest,
  PostTradeDetailsResponse,
} from "../types";
import { OrderError, ValidationError } from "../errors";

/**
 * Post Trade Details module for analyzing trade impact before execution
 */
export class PostTradeDetails {
  private readonly httpClient: HttpClient;
  private readonly chainId: number;

  constructor(httpClient: HttpClient, chainId: number) {
    this.httpClient = httpClient;
    this.chainId = chainId;
  }

  /**
   * Get post-trade details for a market order
   */
  async getPostTradeDetails(
    params: PostTradeDetailsRequest
  ): Promise<PostTradeDetailsResponse> {
    try {
      const response = await this.httpClient.post<PostTradeDetailsResponse>(
        `post-trade-details?chainId=${this.chainId}`,
        params
      );
      return response;
    } catch (error) {
      throw new OrderError(
        `Failed to get post-trade details: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { params }
      );
    }
  }

  /**
   * Get post-trade details for a limit order
   */
  async getPostTradeDetailsLimit(
    params: PostTradeDetailsLimitRequest
  ): Promise<PostTradeDetailsResponse> {
    try {
      const response = await this.httpClient.post<PostTradeDetailsResponse>(
        `post-trade-details?chainId=${this.chainId}`,
        params
      );
      return response;
    } catch (error) {
      throw new OrderError(
        `Failed to get post-trade details for limit order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { params }
      );
    }
  }

  /**
   * Get post-trade details with account ID from stored credentials
   */
  async getPostTradeDetailsForAccount(
    marketId: string,
    sizeDelta: string,
    getAccountId: () => string
  ): Promise<PostTradeDetailsResponse> {
    const accountId = getAccountId();

    return this.getPostTradeDetails({
      accountId,
      marketId,
      sizeDelta,
    });
  }

  /**
   * Get post-trade details for limit order with account ID from stored credentials
   */
  async getPostTradeDetailsLimitForAccount(
    marketId: string,
    sizeDelta: string,
    limitPrice: string,
    getAccountId: () => string
  ): Promise<PostTradeDetailsResponse> {
    const accountId = getAccountId();

    return this.getPostTradeDetailsLimit({
      accountId,
      marketId,
      sizeDelta,
      limitPrice,
    });
  }

  /**
   * Check if a trade is feasible based on post-trade details
   */
  async isTradeFeasible(params: PostTradeDetailsRequest): Promise<boolean> {
    try {
      const details = await this.getPostTradeDetails(params);
      return details.feasible;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if a limit trade is feasible based on post-trade details
   */
  async isLimitTradeFeasible(
    params: PostTradeDetailsLimitRequest
  ): Promise<boolean> {
    try {
      const details = await this.getPostTradeDetailsLimit(params);
      return details.feasible;
    } catch (error) {
      return false;
    }
  }
}
