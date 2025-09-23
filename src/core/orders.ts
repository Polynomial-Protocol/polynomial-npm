import { privateKeyToAccount } from "viem/accounts";
import { HttpClient } from "./http";
import { OrderError, ValidationError, SigningError } from "../errors";
import { MarketOrderRequest, MarketOrderToSign, OrderParams } from "../types";
import { NetworkConfig } from "../config";
import {
  isValidPrivateKey,
  isValidAddress,
  generateNonce,
  getWeekFromNowTimestamp,
  calculateAcceptablePrice,
} from "../utils";

/**
 * Orders module for handling order creation and submission
 */
export class Orders {
  private readonly httpClient: HttpClient;
  private readonly orderbookClient: HttpClient;
  private readonly networkConfig: NetworkConfig;

  constructor(
    httpClient: HttpClient,
    orderbookClient: HttpClient,
    networkConfig: NetworkConfig
  ) {
    this.httpClient = httpClient;
    this.orderbookClient = orderbookClient;
    this.networkConfig = networkConfig;
  }

  /**
   * Signs a market order using EIP-712 typed data
   */
  private async signMarketOrder(
    sessionKey: string,
    order: MarketOrderToSign
  ): Promise<string> {
    if (!isValidPrivateKey(sessionKey)) {
      throw new ValidationError("Invalid session key format", {
        sessionKey: "REDACTED",
      });
    }

    try {
      const {
        marketId,
        accountId,
        sizeDelta,
        settlementStrategyId,
        referrerOrRelayer,
        allowAggregation,
        allowPartialMatching,
        acceptablePrice,
        expiration,
        nonce,
        chainId,
        eoa,
        reduceOnly,
      } = order;

      // Domain setup as per EIP-712
      const domain = {
        name: this.networkConfig.perpFutures.name,
        version: this.networkConfig.perpFutures.version,
        chainId,
        verifyingContract: this.networkConfig.perpFutures
          .address as `0x${string}`,
      };

      // Typed structure for the OffchainOrder object
      const types = {
        OffchainOrder: [
          { name: "marketId", type: "uint128" },
          { name: "accountId", type: "uint128" },
          { name: "sizeDelta", type: "int128" },
          { name: "settlementStrategyId", type: "uint128" },
          { name: "referrerOrRelayer", type: "address" },
          { name: "allowAggregation", type: "bool" },
          { name: "allowPartialMatching", type: "bool" },
          { name: "reduceOnly", type: "bool" },
          { name: "acceptablePrice", type: "uint256" },
          { name: "trackingCode", type: "bytes32" },
          { name: "expiration", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };

      // Final message to sign
      const message = {
        marketId,
        accountId,
        sizeDelta,
        settlementStrategyId,
        referrerOrRelayer,
        allowAggregation,
        allowPartialMatching,
        reduceOnly,
        acceptablePrice,
        trackingCode:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        expiration,
        nonce,
      };

      // Convert session key into a signer account
      const account = privateKeyToAccount(sessionKey as `0x${string}`);

      // Return the EIP-712-compliant signature
      return await account.signTypedData({
        domain,
        types,
        primaryType: "OffchainOrder",
        message,
      });
    } catch (error) {
      throw new SigningError(
        `Failed to sign market order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { marketId: order.marketId, accountId: order.accountId }
      );
    }
  }

  /**
   * Submits a signed market order to the orderbook endpoint
   */
  private async submitMarketOrder(
    marketId: string,
    data: MarketOrderRequest
  ): Promise<any> {
    try {
      return await this.orderbookClient.post(`market_order/${marketId}`, data);
    } catch (error) {
      throw new OrderError(
        `Failed to submit market order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { marketId, orderData: { ...data, id: "REDACTED" } }
      );
    }
  }

  /**
   * Creates and submits a market order
   */
  async createMarketOrder(
    sessionKey: string,
    walletAddress: string,
    accountId: string,
    params: OrderParams,
    defaultSlippage: bigint = 10n
  ): Promise<any> {
    // Validation
    if (!isValidPrivateKey(sessionKey)) {
      throw new ValidationError("Invalid session key format", {
        sessionKey: "REDACTED",
      });
    }

    if (!isValidAddress(walletAddress)) {
      throw new ValidationError("Invalid wallet address format", {
        walletAddress,
      });
    }

    const {
      marketId,
      size,
      isLong,
      acceptablePrice,
      reduceOnly = false,
    } = params;

    try {
      // Calculate acceptable price if not provided
      let finalAcceptablePrice = acceptablePrice;
      if (!finalAcceptablePrice) {
        // For market orders, we need to get current market price
        // This is a simplified approach - in practice, you might want to get this from market data
        throw new ValidationError(
          "Acceptable price must be provided for market orders",
          { marketId }
        );
      }

      // Build the order to sign
      const orderToSign: MarketOrderToSign = {
        marketId,
        accountId,
        sizeDelta: isLong ? size.toString() : `-${size.toString()}`,
        settlementStrategyId: "0",
        referrerOrRelayer: this.networkConfig.relayerAddress,
        allowAggregation: true,
        allowPartialMatching: true,
        acceptablePrice: finalAcceptablePrice.toString(),
        trackingCode:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        expiration: getWeekFromNowTimestamp().toString(),
        nonce: generateNonce(),
        chainId: this.networkConfig.chainId,
        eoa: walletAddress,
        reduceOnly,
      };

      // Sign the order
      const signature = await this.signMarketOrder(sessionKey, orderToSign);

      // Create the market order request
      const marketOrderRequest: MarketOrderRequest = {
        acceptablePrice: orderToSign.acceptablePrice,
        accountId: orderToSign.accountId,
        allowAggregation: orderToSign.allowAggregation,
        allowPartialMatching: orderToSign.allowPartialMatching,
        chainId: orderToSign.chainId,
        expiration: orderToSign.expiration,
        id: signature,
        marketId: orderToSign.marketId,
        nonce: orderToSign.nonce,
        referrerOrRelayer: orderToSign.referrerOrRelayer,
        settlementStrategyId: orderToSign.settlementStrategyId,
        sizeDelta: orderToSign.sizeDelta,
        trackingCode: orderToSign.trackingCode,
        reduceOnly: orderToSign.reduceOnly,
      };

      // Submit the order
      return await this.submitMarketOrder(marketId, marketOrderRequest);
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof OrderError ||
        error instanceof SigningError
      ) {
        throw error;
      }
      throw new OrderError(
        `Failed to create market order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { marketId, accountId, size: size.toString(), isLong }
      );
    }
  }

  /**
   * Creates a long position market order
   */
  async createLongOrder(
    sessionKey: string,
    walletAddress: string,
    accountId: string,
    marketId: string,
    size: bigint,
    acceptablePrice: bigint,
    reduceOnly: boolean = false
  ): Promise<any> {
    return this.createMarketOrder(sessionKey, walletAddress, accountId, {
      marketId,
      size,
      isLong: true,
      acceptablePrice,
      reduceOnly,
    });
  }

  /**
   * Creates a short position market order
   */
  async createShortOrder(
    sessionKey: string,
    walletAddress: string,
    accountId: string,
    marketId: string,
    size: bigint,
    acceptablePrice: bigint,
    reduceOnly: boolean = false
  ): Promise<any> {
    return this.createMarketOrder(sessionKey, walletAddress, accountId, {
      marketId,
      size,
      isLong: false,
      acceptablePrice,
      reduceOnly,
    });
  }

  /**
   * Helper method to calculate acceptable price with slippage
   */
  calculateAcceptablePriceWithSlippage(
    marketPrice: bigint,
    slippagePercentage: bigint,
    isLong: boolean
  ): bigint {
    return calculateAcceptablePrice(marketPrice, slippagePercentage, isLong);
  }
}
