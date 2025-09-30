import { PolynomialSDK } from "../sdk";
import { ConfigurationError, ValidationError, AccountError } from "../../errors";
import { HttpClient } from "../http";

// Mock the HTTP client
jest.mock("../http");

const mockHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

// Mock the get method to return account data
const mockGet = jest.fn();
mockHttpClient.prototype.get = mockGet;

describe("PolynomialSDK", () => {
  const validConfig = {
    apiKey: "test-api-key",
    sessionKey:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    walletAddress: "0x1234567890123456789012345678901234567890",
    chainId: 8008,
  };

  const mockAccountResponse = [
    {
      accountId: "123456789",
      owner: "0x1234567890123456789012345678901234567890",
      superOwner: "0x1234567890123456789012345678901234567890",
      chainId: 8008,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for successful account fetching
    mockGet.mockResolvedValue(mockAccountResponse);
  });

  describe("SDK Creation", () => {
    it("should create SDK instance with valid config", async () => {
      const sdk = await PolynomialSDK.create(validConfig);
      expect(sdk).toBeInstanceOf(PolynomialSDK);
      expect(sdk.markets).toBeDefined();
      expect(sdk.accounts).toBeDefined();
      expect(sdk.orders).toBeDefined();
      expect(mockGet).toHaveBeenCalledWith(
        "accounts?owner=0x1234567890123456789012345678901234567890&ownershipType=SuperOwner&chainIds=8008"
      );
    });

    it("should throw ConfigurationError when API key is missing", async () => {
      await expect(
        PolynomialSDK.create({
          apiKey: "",
          sessionKey:
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          walletAddress: "0x1234567890123456789012345678901234567890",
        })
      ).rejects.toThrow(ConfigurationError);
    });

    it("should throw ConfigurationError when session key is missing", async () => {
      await expect(
        PolynomialSDK.create({
          apiKey: "test-key",
          sessionKey: "",
          walletAddress: "0x1234567890123456789012345678901234567890",
        })
      ).rejects.toThrow(ConfigurationError);
    });

    it("should throw ConfigurationError when wallet address is missing", async () => {
      await expect(
        PolynomialSDK.create({
          apiKey: "test-key",
          sessionKey:
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          walletAddress: "",
        })
      ).rejects.toThrow(ConfigurationError);
    });

    it("should throw ValidationError for invalid wallet address format", async () => {
      await expect(
        PolynomialSDK.create({
          apiKey: "test-key",
          sessionKey:
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          walletAddress: "invalid-address",
        })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw AccountError when no account found", async () => {
      mockGet.mockResolvedValue([]); // No accounts found

      await expect(PolynomialSDK.create(validConfig)).rejects.toThrow(
        AccountError
      );
    });

    it("should throw AccountError when account for wrong chain", async () => {
      mockGet.mockResolvedValue([
        {
          accountId: "123456789",
          owner: "0x1234567890123456789012345678901234567890",
          superOwner: "0x1234567890123456789012345678901234567890",
          chainId: 1337, // Different chain ID
        },
      ]);

      await expect(PolynomialSDK.create(validConfig)).rejects.toThrow(
        AccountError
      );
    });

    it("should use default values for optional config", async () => {
      const sdk = await PolynomialSDK.create({
        apiKey: "test-key",
        sessionKey:
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        walletAddress: "0x1234567890123456789012345678901234567890",
      });
      const config = sdk.getConfig();

      expect(config.chainId).toBe(8008);
      expect(config.defaultSlippage).toBe(10n);
      expect(config.apiEndpoint).toBe(
        "https://perps-api-mainnet.polynomial.finance"
      );
    });

    it("should override defaults with provided config", async () => {
      const customConfig = {
        apiKey: "test-key",
        sessionKey:
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        walletAddress: "0x1234567890123456789012345678901234567890",
        chainId: 1337,
        defaultSlippage: 5n,
        apiEndpoint: "https://custom-api.example.com",
      };

      // Mock response for custom chain
      mockGet.mockResolvedValue([
        {
          accountId: "987654321",
          owner: "0x1234567890123456789012345678901234567890",
          superOwner: "0x1234567890123456789012345678901234567890",
          chainId: 1337,
        },
      ]);

      const sdk = await PolynomialSDK.create(customConfig);
      const config = sdk.getConfig();

      expect(config.chainId).toBe(1337);
      expect(config.defaultSlippage).toBe(5n);
      expect(config.apiEndpoint).toBe("https://custom-api.example.com");
    });
  });

  describe("Static Methods", () => {
    it("should create SDK instance via static create method", async () => {
      const sdk = await PolynomialSDK.create(validConfig);
      expect(sdk).toBeInstanceOf(PolynomialSDK);
    });
  });

  describe("Configuration Methods", () => {
    let sdk: PolynomialSDK;

    beforeEach(async () => {
      sdk = await PolynomialSDK.create(validConfig);
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

    beforeEach(async () => {
      sdk = await PolynomialSDK.create(validConfig);

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
      expect(sdk.accounts.getAccountSummary).toHaveBeenCalledWith(
        "0x1234567890123456789012345678901234567890"
      );
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
        status: "submitted",
      });

      const result = await sdk.createOrder(
        "market-1",
        BigInt("1000000000000000000")
      );
      expect(result).toBeDefined();
      expect(result.orderId).toBe("order-123");
      expect(sdk.orders.createOrder).toHaveBeenCalledWith(
        "market-1",
        BigInt("1000000000000000000"),
        undefined
      );
    });
  });
});
