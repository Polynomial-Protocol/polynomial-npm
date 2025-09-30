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
  parseUnits,
} from "../utils";

/**
 * Orders module for handling order creation and submission
 */
export class Orders {
  private readonly httpClient: HttpClient;
  private readonly orderbookClient: HttpClient;
  private readonly networkConfig: NetworkConfig;
  private readonly sessionKey: string;
  private readonly walletAddress: string;
  private readonly getAccountId: () => string;

  constructor(
    httpClient: HttpClient,
    orderbookClient: HttpClient,
    networkConfig: NetworkConfig,
    sessionKey: string,
    walletAddress: string,
    getAccountId: () => string
  ) {
    this.httpClient = httpClient;
    this.orderbookClient = orderbookClient;
    this.networkConfig = networkConfig;
    this.sessionKey = sessionKey;
    this.walletAddress = walletAddress;
    this.getAccountId = getAccountId;
  }

  /**
   * Fetches current market price for a given market ID
   */
  private async getMarketPrice(marketId: string): Promise<bigint> {
    try {
      const response = await this.httpClient.get<any>(
        `markets?chainId=${this.networkConfig.chainId}`
      );

      const market = response.markets?.find(
        (m: any) => m.marketId === marketId
      );
      if (!market) {
        throw new ValidationError(`Market not found: ${marketId}`, {
          marketId,
        });
      }

      // Convert market price to bigint (assuming price is in standard format)
      return parseUnits(market.price.toString());
    } catch (error) {
      throw new OrderError(
        `Failed to fetch market price for ${marketId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { marketId }
      );
    }
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
   * Creates and submits a market order using stored credentials
   */
  async createMarketOrder(
    params: OrderParams,
    defaultSlippage: bigint = 10n
  ): Promise<any> {
    // Get account ID from stored credentials
    const accountId = this.getAccountId();
    const {
      marketId,
      size,
      isLong = true, // Default to long position
      acceptablePrice,
      reduceOnly = false,
      slippagePercentage,
    } = params;

    try {
      // Calculate acceptable price if not provided
      let finalAcceptablePrice = acceptablePrice;
      if (!finalAcceptablePrice) {
        // Fetch current market price
        const marketPrice = await this.getMarketPrice(marketId);

        // Use provided slippage or default
        const slippage = slippagePercentage || defaultSlippage;

        // Calculate acceptable price with slippage protection
        finalAcceptablePrice = calculateAcceptablePrice(
          marketPrice,
          slippage,
          isLong
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
        eoa: this.walletAddress,
        reduceOnly,
      };

      // Sign the order
      const signature = await this.signMarketOrder(
        this.sessionKey,
        orderToSign
      );

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
        {
          marketId,
          accountId,
          size: size.toString(),
          isLong,
          walletAddress: this.walletAddress,
        }
      );
    }
  }

  /**
   * Creates a simple market order with minimal parameters
   * All other values will be calculated automatically or use defaults
   */
  async createOrder(
    marketId: string,
    size: bigint,
    options?: {
      isLong?: boolean;
      acceptablePrice?: bigint;
      reduceOnly?: boolean;
      slippagePercentage?: bigint;
    }
  ): Promise<any> {
    return this.createMarketOrder({
      marketId,
      size,
      ...options,
    });
  }

  /**
   * Creates a long position market order
   */
  async createLongOrder(
    marketId: string,
    size: bigint,
    acceptablePrice?: bigint,
    reduceOnly: boolean = false
  ): Promise<any> {
    return this.createMarketOrder({
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
    marketId: string,
    size: bigint,
    acceptablePrice?: bigint,
    reduceOnly: boolean = false
  ): Promise<any> {
    return this.createMarketOrder({
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
