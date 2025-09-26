import { HttpClient } from "./http";
import { Markets } from "./markets";
import { Accounts } from "./accounts";
import { Orders } from "./orders";
import { ConfigurationError, ValidationError } from "../errors";
import { SDKConfig, NETWORKS, NetworkConfig } from "../config";
import { isValidAddress } from "../utils";

/**
 * Main Polynomial SDK class
 */
export class PolynomialSDK {
  private readonly config: Required<SDKConfig>;
  private readonly networkConfig: NetworkConfig;
  private readonly httpClient: HttpClient;
  private readonly orderbookClient: HttpClient;

  // Module instances
  public readonly markets: Markets;
  public readonly accounts: Accounts;
  public readonly orders: Orders;

  constructor(config: SDKConfig) {
    // Validate required configuration
    if (!config.apiKey) {
      throw new ConfigurationError("API key is required", {
        providedConfig: { ...config, apiKey: "REDACTED" },
      });
    }

    // Set up configuration with defaults
    this.config = {
      chainId: config.chainId || 8008,
      apiEndpoint: config.apiEndpoint || NETWORKS.mainnet!.apiEndpoint,
      orderbookEndpoint:
        config.orderbookEndpoint || NETWORKS.mainnet!.orderbookEndpoint,
      relayerAddress: config.relayerAddress || NETWORKS.mainnet!.relayerAddress,
      defaultSlippage: config.defaultSlippage || 10n,
      apiKey: config.apiKey,
    };

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
    this.accounts = new Accounts(this.httpClient, this.config.chainId);
    this.orders = new Orders(
      this.httpClient,
      this.orderbookClient,
      this.networkConfig
    );
  }

  /**
   * Creates a new SDK instance with the provided configuration
   */
  static create(config: SDKConfig): PolynomialSDK {
    return new PolynomialSDK(config);
  }

  /**
   * Gets the current configuration
   */
  getConfig(): Readonly<Required<SDKConfig>> {
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
   * Convenience method to create a market order with trade simulation
   */
  async createMarketOrderWithSimulation(
    sessionKey: string,
    walletAddress: string,
    marketSymbol: string,
    size: bigint,
    isLong: boolean,
    maxSlippage?: bigint
  ): Promise<{
    simulation: any;
    orderResult: any;
  }> {
    // Validate inputs
    if (!isValidAddress(walletAddress)) {
      throw new ValidationError("Invalid wallet address format", {
        walletAddress,
      });
    }

    try {
      // Get account
      const account = await this.accounts.getAccount(walletAddress);
      if (!account) {
        throw new ValidationError(
          `No account found for wallet address: ${walletAddress}`,
          { walletAddress }
        );
      }

      // Get market
      const market = await this.markets.getMarketBySymbol(marketSymbol);
      if (!market) {
        throw new ValidationError(
          `Market not found for symbol: ${marketSymbol}`,
          { marketSymbol }
        );
      }

      // Simulate the trade
      const simulation = await this.markets.simulateTrade({
        accountId: account.accountId,
        marketId: market.marketId,
        sizeDelta: isLong ? size : -size,
      });

      // Check if trade is feasible
      if (!simulation.feasible) {
        throw new ValidationError(
          `Trade not feasible: ${simulation.errorMsg || "Unknown reason"}`,
          { simulation }
        );
      }

      // Calculate acceptable price with slippage
      const fillPrice = BigInt(simulation.fillPrice);
      const slippage = maxSlippage || this.config.defaultSlippage;
      const acceptablePrice = this.orders.calculateAcceptablePriceWithSlippage(
        fillPrice,
        slippage,
        isLong
      );

      // Create the order
      const orderResult = await this.orders.createMarketOrder(
        sessionKey,
        walletAddress,
        account.accountId,
        {
          marketId: market.marketId,
          size,
          isLong,
          acceptablePrice,
        }
      );

      return {
        simulation,
        orderResult,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        `Failed to create market order with simulation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { marketSymbol, size: size.toString(), isLong }
      );
    }
  }

  /**
   * Convenience method to get account summary with positions
   */
  async getAccountSummary(walletAddress: string) {
    if (!isValidAddress(walletAddress)) {
      throw new ValidationError("Invalid wallet address format", {
        walletAddress,
      });
    }

    return await this.accounts.getAccountSummary(walletAddress);
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
}
