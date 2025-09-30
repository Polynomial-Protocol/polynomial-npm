export declare const API_ENDPOINT = "https://perps-api-mainnet.polynomial.finance";
export declare const API_ORDERBOOK_ENDPOINT = "https://orderbook-mainnet.polynomial.finance/api";
export declare const CHAIN_ID = 8008;
export declare const RELAYER_ADDRESS = "0x4D387f5c0Ec87e47b9Df9b8C97B89D2977431b27";
export declare const ZERO_HEX_32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
export declare const PERP_FUTURES: {
    name: string;
    version: string;
    address: string;
};
export declare const DEFAULT_SLIPPAGE_PERCENTAGE = 10n;
export declare const DECIMALS = 18;
/**
 * SDK Configuration interface
 */
export interface SDKConfig {
    apiKey: string;
    chainId?: number;
    apiEndpoint?: string;
    orderbookEndpoint?: string;
    relayerAddress?: string;
    defaultSlippage?: bigint;
    walletAddress: string;
    sessionKey: string;
}
/**
 * Network configuration for different chains
 */
export interface NetworkConfig {
    chainId: number;
    apiEndpoint: string;
    orderbookEndpoint: string;
    relayerAddress: string;
    perpFutures: {
        name: string;
        version: string;
        address: string;
    };
}
/**
 * Predefined network configurations
 */
export declare const NETWORKS: Record<string, NetworkConfig>;
//# sourceMappingURL=index.d.ts.map