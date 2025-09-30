import { PolynomialSDK } from "../sdk";
import { ConfigurationError, ValidationError } from "../../errors";

// Mock the HTTP client
jest.mock("../http");

describe("PolynomialSDK", () => {
  const validConfig = {
    apiKey: "test-api-key",
    sessionKey:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    walletAddress: "0x1234567890123456789012345678901234567890",
    chainId: 8008,
  };

  describe("Constructor", () => {
    it("should create SDK instance with valid config", () => {
      const sdk = new PolynomialSDK(validConfig);
      expect(sdk).toBeInstanceOf(PolynomialSDK);
      expect(sdk.markets).toBeDefined();
      expect(sdk.accounts).toBeDefined();
      expect(sdk.orders).toBeDefined();
    });

    it("should throw ConfigurationError when API key is missing", () => {
      expect(() => {
        new PolynomialSDK({ 
          apiKey: "",
          sessionKey: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          walletAddress: "0x1234567890123456789012345678901234567890"
        });
      }).toThrow(ConfigurationError);
    });

    it("should throw ConfigurationError when session key is missing", () => {
      expect(() => {
        new PolynomialSDK({ 
          apiKey: "test-key",
          sessionKey: "",
          walletAddress: "0x1234567890123456789012345678901234567890"
        });
      }).toThrow(ConfigurationError);
    });

    it("should throw ConfigurationError when wallet address is missing", () => {
      expect(() => {
        new PolynomialSDK({ 
          apiKey: "test-key",
          sessionKey: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          walletAddress: ""
        });
      }).toThrow(ConfigurationError);
    });

    it("should throw ValidationError for invalid wallet address format", () => {
      expect(() => {
        new PolynomialSDK({ 
          apiKey: "test-key",
          sessionKey: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          walletAddress: "invalid-address"
        });
      }).toThrow(ValidationError);
    });

    it("should use default values for optional config", () => {
      const sdk = new PolynomialSDK({ 
        apiKey: "test-key",
        sessionKey: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        walletAddress: "0x1234567890123456789012345678901234567890"
      });
      const config = sdk.getConfig();

      expect(config.chainId).toBe(8008);
      expect(config.defaultSlippage).toBe(10n);
      expect(config.apiEndpoint).toBe(
        "https://perps-api-mainnet.polynomial.finance"
      );
    });

    it("should override defaults with provided config", () => {
      const customConfig = {
        apiKey: "test-key",
        sessionKey: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        walletAddress: "0x1234567890123456789012345678901234567890",
        chainId: 1337,
        defaultSlippage: 5n,
        apiEndpoint: "https://custom-api.example.com",
      };

      const sdk = new PolynomialSDK(customConfig);
      const config = sdk.getConfig();

      expect(config.chainId).toBe(1337);
      expect(config.defaultSlippage).toBe(5n);
      expect(config.apiEndpoint).toBe("https://custom-api.example.com");
    });
  });

  describe("Static Methods", () => {
    it("should create SDK instance via static create method", () => {
      const sdk = PolynomialSDK.create(validConfig);
      expect(sdk).toBeInstanceOf(PolynomialSDK);
    });
  });

  describe("Configuration Methods", () => {
    let sdk: PolynomialSDK;

    beforeEach(() => {
      sdk = new PolynomialSDK(validConfig);
    });

    it("should return readonly config", () => {
      const config = sdk.getConfig();
      expect(config).toBeDefined();
      expect(config.apiKey).toBe("test-api-key");
      expect(config.chainId).toBe(8008);
    });

    it("should return readonly network config", () => {
      const networkConfig = sdk.getNetworkConfig();
      expect(networkConfig).toBeDefined();
      expect(networkConfig.chainId).toBe(8008);
      expect(networkConfig.apiEndpoint).toBeDefined();
    });

    it("should update API key", () => {
      expect(() => {
        sdk.updateApiKey("new-api-key");
      }).not.toThrow();
    });

    it("should throw ValidationError for empty API key", () => {
      expect(() => {
        sdk.updateApiKey("");
      }).toThrow(ValidationError);
    });
  });

  describe("Convenience Methods", () => {
    let sdk: PolynomialSDK;

    beforeEach(() => {
      sdk = new PolynomialSDK(validConfig);

      // Mock the module methods
      jest.spyOn(sdk.accounts, "getAccount").mockResolvedValue({
        accountId: "123",
        owner: "0x123",
        superOwner: "0x123",
        chainId: 8008,
      });

      jest.spyOn(sdk.markets, "getMarketBySymbol").mockResolvedValue({
        marketId: "1",
        symbol: "ETH",
        price: 2000,
        skew: "0",
        currentOI: "1000000",
        currentFundingRate: "0.01",
        currentFundingVelocity: "0.001",
        makerFeeRatio: "0.0001",
        takerFeeRatio: "0.0005",
        skewScale: "1000000",
        maxMarketSize: "10000000",
        maxMarketValue: "20000000",
        tradesCount24h: 100,
        tradesVolume24h: 1000000,
        price24HrAgo: 1950,
        markPrice: "2000",
        longOI: "500000",
        shortOI: "500000",
        currentSkew: "0",
        positiveSkew: "1000",
        negativeSkew: "-1000",
        availableLiquidityLong: "5000000",
        availableLiquidityShort: "5000000",
        currentFundingRate1HInPercentage: "0.01",
        currentFundingRate8HInPercentage: "0.08",
        currentFundingRate1YInPercentage: "8.76",
        currentInterestRate1HInPercentage: "0.005",
        currentInterestRate8HInPercentage: "0.04",
        currentInterestRate1YInPercentage: "4.38",
        netLongFundingRate1HInPercentage: "0.015",
        netLongFundingRate8HInPercentage: "0.12",
        netLongFundingRate1YInPercentage: "10.95",
        netShortFundingRate1HInPercentage: "0.005",
        netShortFundingRate8HInPercentage: "0.04",
        netShortFundingRate1YInPercentage: "4.38",
      });
    });

    it("should get account summary using stored wallet address", async () => {
      jest.spyOn(sdk.accounts, "getAccountSummary").mockResolvedValue({
        account: {
          accountId: "123",
          owner: "0x123",
          superOwner: "0x123",
          chainId: 8008,
        },
        positions: [],
        totalPositions: 0,
        totalUnrealizedPnl: "0.00",
        totalRealizedPnl: "0.00",
      });

      const summary = await sdk.getAccountSummary();
      expect(summary).toBeDefined();
      expect(summary.account.accountId).toBe("123");
      expect(sdk.accounts.getAccountSummary).toHaveBeenCalledWith("0x1234567890123456789012345678901234567890");
    });

    it("should get market data for specific symbol", async () => {
      jest.spyOn(sdk.markets, "getMarketStats").mockResolvedValue({
        marketId: "1",
        symbol: "ETH",
        price: 2000,
        markPrice: "2000",
      });

      const marketData = await sdk.getMarketData("ETH");
      expect(marketData).toBeDefined();
      expect((marketData as any)?.symbol).toBe("ETH");
    });

    it("should get all markets when no symbol provided", async () => {
      jest.spyOn(sdk.markets, "getMarkets").mockResolvedValue([
        {
          marketId: "1",
          symbol: "ETH",
          price: 2000,
          skew: "0",
          currentOI: "1000000",
          currentFundingRate: "0.01",
          currentFundingVelocity: "0.001",
          makerFeeRatio: "0.0001",
          takerFeeRatio: "0.0005",
          skewScale: "1000000",
          maxMarketSize: "10000000",
          maxMarketValue: "20000000",
          tradesCount24h: 100,
          tradesVolume24h: 1000000,
          price24HrAgo: 1950,
          markPrice: "2000",
          longOI: "500000",
          shortOI: "500000",
          currentSkew: "0",
          positiveSkew: "1000",
          negativeSkew: "-1000",
          availableLiquidityLong: "5000000",
          availableLiquidityShort: "5000000",
          currentFundingRate1HInPercentage: "0.01",
          currentFundingRate8HInPercentage: "0.08",
          currentFundingRate1YInPercentage: "8.76",
          currentInterestRate1HInPercentage: "0.005",
          currentInterestRate8HInPercentage: "0.04",
          currentInterestRate1YInPercentage: "4.38",
          netLongFundingRate1HInPercentage: "0.015",
          netLongFundingRate8HInPercentage: "0.12",
          netLongFundingRate1YInPercentage: "10.95",
          netShortFundingRate1HInPercentage: "0.005",
          netShortFundingRate8HInPercentage: "0.04",
          netShortFundingRate1YInPercentage: "4.38",
        },
      ]);

      const markets = await sdk.getMarketData();
      expect(Array.isArray(markets)).toBe(true);
      expect(markets).toHaveLength(1);
    });

    it("should create order using stored credentials", async () => {
      jest.spyOn(sdk.orders, "createOrder").mockResolvedValue({
        orderId: "order-123",
        status: "submitted"
      });

      const result = await sdk.createOrder("market-1", BigInt("1000000000000000000"));
      expect(result).toBeDefined();
      expect(result.orderId).toBe("order-123");
      expect(sdk.orders.createOrder).toHaveBeenCalledWith(
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "0x1234567890123456789012345678901234567890",
        "123",
        "market-1",
        BigInt("1000000000000000000"),
        undefined
      );
    });
  });
});
