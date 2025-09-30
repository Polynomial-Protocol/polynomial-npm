import { HttpClient } from "./http";
import { Markets } from "./markets";
import { Accounts } from "./accounts";
import { Orders } from "./orders";
import { ConfigurationError, ValidationError, AccountError } from "../errors";
import { SDKConfig, NETWORKS, NetworkConfig } from "../config";
import { isValidAddress } from "../utils";
import { IAccountAPIResponse } from "../types";

/**
 * Internal SDK config type - all fields are required
 */
type InternalSDKConfig = Required<SDKConfig>;

/**
 * Main Polynomial SDK class
 */
export class PolynomialSDK {
  private readonly config: InternalSDKConfig;
  private readonly networkConfig: NetworkConfig;
  private readonly httpClient: HttpClient;
  private readonly orderbookClient: HttpClient;
  private readonly walletAddress: string;
  private readonly sessionKey: string;
  private accountId: string; // Fetched from API during initialization

  // Module instances
  public readonly markets: Markets;
  public readonly accounts: Accounts;
  public readonly orders: Orders;

  private constructor(config: SDKConfig, accountId: string) {
    // Validate required configuration
    if (!config.apiKey) {
      throw new ConfigurationError("API key is required", {
        providedConfig: { ...config, apiKey: "REDACTED" },
      });
    }

    if (!config.walletAddress) {
      throw new ConfigurationError(
        "Wallet address is required for SDK initialization",
        {
          providedConfig: {
            ...config,
            apiKey: "REDACTED",
            sessionKey: "REDACTED",
          },
        }
      );
    }

    if (!config.sessionKey) {
      throw new ConfigurationError(
        "Session key is required for SDK initialization",
        {
          providedConfig: {
            ...config,
            apiKey: "REDACTED",
            sessionKey: "REDACTED",
          },
        }
      );
    }

    // Validate wallet address format
    if (!isValidAddress(config.walletAddress)) {
      throw new ValidationError("Invalid wallet address format", {
        walletAddress: config.walletAddress,
      });
    }

    // Set up configuration with defaults first
    this.config = {
      chainId: config.chainId || 8008,
      apiEndpoint: config.apiEndpoint || NETWORKS.mainnet!.apiEndpoint,
      orderbookEndpoint:
        config.orderbookEndpoint || NETWORKS.mainnet!.orderbookEndpoint,
      relayerAddress: config.relayerAddress || NETWORKS.mainnet!.relayerAddress,
      defaultSlippage: config.defaultSlippage || 10n,
      apiKey: config.apiKey,
      walletAddress: config.walletAddress,
      sessionKey: config.sessionKey,
    };

    // Store authentication credentials
    this.walletAddress = config.walletAddress;
    this.sessionKey = config.sessionKey;

    // Store the fetched account ID
    this.accountId = accountId;

    // Get network configuration
    const networkKey = Object.keys(NETWORKS).find(
      (key) => NETWORKS[key]!.chainId === this.config.chainId
    );

    if (networkKey) {
      this.networkConfig = NETWORKS[networkKey]!;
    } else {
      // Create custom network config
      this.networkConfig = {
        chainId: this.config.chainId,
        apiEndpoint: this.config.apiEndpoint,
        orderbookEndpoint: this.config.orderbookEndpoint,
        relayerAddress: this.config.relayerAddress,
        perpFutures: NETWORKS.mainnet!.perpFutures, // Use mainnet as default
      };
    }

    // Initialize HTTP clients
    this.httpClient = new HttpClient(
      this.config.apiEndpoint,
      this.config.apiKey
    );
    this.orderbookClient = new HttpClient(
      this.config.orderbookEndpoint,
      this.config.apiKey
    );

    // Initialize modules
    this.markets = new Markets(this.httpClient, this.config.chainId);
    this.accounts = new Accounts(
      this.httpClient,
      this.config.chainId,
      this.walletAddress,
      () => this.getAccountId()
    );
    this.orders = new Orders(
      this.httpClient,
      this.orderbookClient,
      this.networkConfig,
      this.sessionKey,
      this.walletAddress,
      () => this.getAccountId()
    );
  }

  /**
   * Gets the account ID that was fetched from the API during initialization
   */
  private getAccountId(): string {
    return this.accountId;
  }

  /**
   * Creates a new SDK instance with the provided configuration
   * Fetches the account ID from the API during initialization
   */
  static async create(config: SDKConfig): Promise<PolynomialSDK> {
    // Validate required configuration before making API calls
    if (!config.apiKey) {
      throw new ConfigurationError("API key is required", {
        providedConfig: { ...config, apiKey: "REDACTED" },
      });
    }

    if (!config.walletAddress) {
      throw new ConfigurationError(
        "Wallet address is required for SDK initialization",
        {
          providedConfig: {
            ...config,
            apiKey: "REDACTED",
            sessionKey: "REDACTED",
          },
        }
      );
    }

    if (!config.sessionKey) {
      throw new ConfigurationError(
        "Session key is required for SDK initialization",
        {
          providedConfig: {
            ...config,
            apiKey: "REDACTED",
            sessionKey: "REDACTED",
          },
        }
      );
    }

    // Validate wallet address format
    if (!isValidAddress(config.walletAddress)) {
      throw new ValidationError("Invalid wallet address format", {
        walletAddress: config.walletAddress,
      });
    }

    // Set up temporary configuration to fetch account ID
    const chainId = config.chainId || 8008;
    const apiEndpoint = config.apiEndpoint || NETWORKS.mainnet!.apiEndpoint;

    // Create temporary HTTP client to fetch account ID
    const tempHttpClient = new HttpClient(apiEndpoint, config.apiKey);

    try {
      // Fetch account information from API
      const response = await tempHttpClient.get<IAccountAPIResponse[]>(
        `accounts?owner=${config.walletAddress}&ownershipType=SuperOwner&chainIds=${chainId}`
      );

      const account = response.find((item) => item.chainId === chainId);

      if (!account) {
        throw new AccountError(
          `No account found for wallet ${config.walletAddress} on chain ${chainId}. Please ensure the wallet has an active account on the Polynomial platform.`,
          {
            walletAddress: config.walletAddress,
            chainId,
          }
        );
      }

      // Create SDK instance with the fetched account ID
      return new PolynomialSDK(config, account.accountId);
    } catch (error) {
      if (
        error instanceof AccountError ||
        error instanceof ConfigurationError ||
        error instanceof ValidationError
      ) {
        throw error;
      }
      throw new AccountError(
        `Failed to fetch account ID for wallet ${config.walletAddress}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { walletAddress: config.walletAddress, chainId }
      );
    }
  }

  /**
   * Gets the current configuration
   */
  getConfig(): Readonly<InternalSDKConfig> {
    return { ...this.config };
  }

  /**
   * Gets the network configuration
   */
  getNetworkConfig(): Readonly<NetworkConfig> {
    return { ...this.networkConfig };
  }

  /**
   * Updates the API key
   */
  updateApiKey(newApiKey: string): void {
    if (!newApiKey) {
      throw new ValidationError("API key cannot be empty");
    }

    this.httpClient.updateApiKey(newApiKey);
    this.orderbookClient.updateApiKey(newApiKey);
  }

  /**
   * Simple convenience method to create an order with minimal parameters
   * Only marketId and size are required, everything else uses sensible defaults
   * Uses the sessionKey and walletAddress provided during SDK initialization
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
    try {
      // Create the order using the Orders module with stored credentials (including account ID)
      return await this.orders.createOrder(marketId, size, options);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        `Failed to create order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { marketId, size: size.toString(), walletAddress: this.walletAddress }
      );
    }
  }

  /**
   * Convenience method to get account summary with positions
   * Uses the walletAddress provided during SDK initialization
   */
  async getAccountSummary() {
    // Validate that wallet address is available
    if (!this.walletAddress) {
      throw new ValidationError(
        "Wallet address is required for account operations. Please provide walletAddress when creating the SDK instance.",
        { operation: "account_summary" }
      );
    }

    return await this.accounts.getAccountSummaryForWallet(this.walletAddress);
  }

  /**
   * Convenience method to get market data with statistics
   */
  async getMarketData(symbol?: string) {
    if (symbol) {
      const market = await this.markets.getMarketBySymbol(symbol);
      if (!market) {
        return null;
      }
      return await this.markets.getMarketStats(market.marketId);
    }

    return await this.markets.getMarkets();
  }

  /**
   * Convenience method to get margin information for the stored account
   * Uses the walletAddress provided during SDK initialization
   */
  async getMarginInfo() {
    // Validate that wallet address is available
    if (!this.walletAddress) {
      throw new ValidationError(
        "Wallet address is required for margin operations. Please provide walletAddress when creating the SDK instance.",
        { operation: "margin_info" }
      );
    }

    return await this.accounts.getMarginInfo();
  }

  /**
   * Convenience method to get maximum possible trade sizes for a market
   * Uses the walletAddress provided during SDK initialization
   */
  async getMaxPossibleTradeSizes(marketId: string) {
    // Validate that wallet address is available
    if (!this.walletAddress) {
      throw new ValidationError(
        "Wallet address is required for trade size operations. Please provide walletAddress when creating the SDK instance.",
        { operation: "max_trade_sizes" }
      );
    }

    return await this.accounts.getMaxPossibleTradeSizes(marketId);
  }
}
