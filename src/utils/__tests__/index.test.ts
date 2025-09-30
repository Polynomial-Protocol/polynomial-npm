import {
  parseUnits,
  formatUnits,
  calculateAcceptablePrice,
  formatPrice,
  calculatePositionValue,
  isValidAddress,
  isValidPrivateKey,
  generateNonce,
  percentageToBasisPoints,
  basisPointsToPercentage,
  getWeekFromNowTimestamp,
} from "../index";

describe("Utility Functions", () => {
  describe("parseUnits", () => {
    it("should convert decimal to bigint with default decimals", () => {
      const result = parseUnits("1.5");
      expect(result).toBe(1500000000000000000n);
    });

    it("should convert decimal to bigint with custom decimals", () => {
      const result = parseUnits("1.5", 6);
      expect(result).toBe(1500000n);
    });

    it("should handle string input", () => {
      const result = parseUnits("0.001");
      expect(result).toBe(1000000000000000n);
    });

    it("should handle number input", () => {
      const result = parseUnits(0.001);
      expect(result).toBe(1000000000000000n);
    });
  });

  describe("formatUnits", () => {
    it("should convert bigint to decimal with default decimals", () => {
      const result = formatUnits(1500000000000000000n);
      expect(result).toBe("1.5");
    });

    it("should convert bigint to decimal with custom decimals", () => {
      const result = formatUnits(1500000n, 6);
      expect(result).toBe("1.5");
    });

    it("should handle zero value", () => {
      const result = formatUnits(0n);
      expect(result).toBe("0");
    });
  });

  describe("calculateAcceptablePrice", () => {
    it("should calculate acceptable price for long position", () => {
      const marketPrice = 2000n * 10n ** 18n; // $2000
      const slippage = 5n; // 5%
      const result = calculateAcceptablePrice(marketPrice, slippage, true);

      const expected = (marketPrice * 105n) / 100n; // +5% for long
      expect(result).toBe(expected);
    });

    it("should calculate acceptable price for short position", () => {
      const marketPrice = 2000n * 10n ** 18n; // $2000
      const slippage = 5n; // 5%
      const result = calculateAcceptablePrice(marketPrice, slippage, false);

      const expected = (marketPrice * 95n) / 100n; // -5% for short
      expect(result).toBe(expected);
    });
  });

  describe("formatPrice", () => {
    it("should format price with default display decimals", () => {
      const price = 2000n * 10n ** 18n;
      const result = formatPrice(price);
      expect(result).toBe("2000.0000");
    });

    it("should format price with custom display decimals", () => {
      const price = 2000123n * 10n ** 15n;
      const result = formatPrice(price, 18, 2);
      expect(result).toBe("2000.12");
    });

    it("should handle string input", () => {
      const result = formatPrice("2000000000000000000000");
      expect(result).toBe("2000.0000");
    });
  });

  describe("calculatePositionValue", () => {
    it("should calculate USD value of position", () => {
      const size = 1n * 10n ** 18n; // 1 unit
      const price = 2000n * 10n ** 18n; // $2000 per unit
      const result = calculatePositionValue(size, price);
      expect(result).toBe("2000.00");
    });

    it("should handle fractional positions", () => {
      const size = 5n * 10n ** 17n; // 0.5 units
      const price = 2000n * 10n ** 18n; // $2000 per unit
      const result = calculatePositionValue(size, price);
      expect(result).toBe("1000.00");
    });
  });

  describe("isValidAddress", () => {
    it("should validate correct Ethereum addresses", () => {
      expect(isValidAddress("0x1234567890123456789012345678901234567890")).toBe(
        true
      );
      expect(isValidAddress("0xAbCdEf1234567890123456789012345678901234")).toBe(
        true
      );
    });

    it("should reject invalid addresses", () => {
      expect(isValidAddress("invalid")).toBe(false);
      expect(isValidAddress("0x123")).toBe(false);
      expect(isValidAddress("1234567890123456789012345678901234567890")).toBe(
        false
      );
      expect(isValidAddress("0xGHIJKL1234567890123456789012345678901234")).toBe(
        false
      );
    });
  });

  describe("isValidPrivateKey", () => {
    it("should validate correct private keys", () => {
      const validKey =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      expect(isValidPrivateKey(validKey)).toBe(true);
    });

    it("should reject invalid private keys", () => {
      expect(isValidPrivateKey("invalid")).toBe(false);
      expect(isValidPrivateKey("0x123")).toBe(false);
      expect(
        isValidPrivateKey(
          "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        )
      ).toBe(false);
    });
  });

  describe("generateNonce", () => {
    it("should generate a string nonce", () => {
      const nonce = generateNonce();
      expect(typeof nonce).toBe("string");
      expect(parseInt(nonce)).toBeGreaterThan(0);
    });

    it("should generate unique nonces", async () => {
      // Generate multiple nonces and check that at least some are different
      const nonces = [];
      for (let i = 0; i < 10; i++) {
        nonces.push(generateNonce());
        // Small delay to ensure different timestamps
        await new Promise((resolve) => setTimeout(resolve, 1));
      }

      // Check that we have at least some unique values
      const uniqueNonces = new Set(nonces);
      expect(uniqueNonces.size).toBeGreaterThan(1);
    });
  });

  describe("percentageToBasisPoints", () => {
    it("should convert percentage to basis points", () => {
      expect(percentageToBasisPoints(1.5)).toBe(150);
      expect(percentageToBasisPoints(0.01)).toBe(1);
      expect(percentageToBasisPoints(10)).toBe(1000);
    });

    it("should handle zero percentage", () => {
      expect(percentageToBasisPoints(0)).toBe(0);
    });
  });

  describe("basisPointsToPercentage", () => {
    it("should convert basis points to percentage", () => {
      expect(basisPointsToPercentage(150)).toBe(1.5);
      expect(basisPointsToPercentage(1)).toBe(0.01);
      expect(basisPointsToPercentage(1000)).toBe(10);
    });

    it("should handle zero basis points", () => {
      expect(basisPointsToPercentage(0)).toBe(0);
    });
  });

  describe("getWeekFromNowTimestamp", () => {
    it("should return a timestamp one week from now", () => {
      const now = Math.floor(Date.now() / 1000);
      const weekFromNow = getWeekFromNowTimestamp();
      const expectedMin = now + 7 * 24 * 60 * 60 - 1; // Allow 1 second tolerance
      const expectedMax = now + 7 * 24 * 60 * 60 + 1;

      expect(weekFromNow).toBeGreaterThanOrEqual(expectedMin);
      expect(weekFromNow).toBeLessThanOrEqual(expectedMax);
    });

    it("should return a number", () => {
      const result = getWeekFromNowTimestamp();
      expect(typeof result).toBe("number");
      expect(Number.isInteger(result)).toBe(true);
    });
  });
});
