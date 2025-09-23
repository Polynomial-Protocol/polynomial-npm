"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.HttpClient = exports.Orders = exports.Accounts = exports.Markets = exports.PolynomialSDK = void 0;
// Core SDK
var sdk_1 = require("./core/sdk");
Object.defineProperty(exports, "PolynomialSDK", { enumerable: true, get: function () { return sdk_1.PolynomialSDK; } });
// Module exports
var markets_1 = require("./core/markets");
Object.defineProperty(exports, "Markets", { enumerable: true, get: function () { return markets_1.Markets; } });
var accounts_1 = require("./core/accounts");
Object.defineProperty(exports, "Accounts", { enumerable: true, get: function () { return accounts_1.Accounts; } });
var orders_1 = require("./core/orders");
Object.defineProperty(exports, "Orders", { enumerable: true, get: function () { return orders_1.Orders; } });
var http_1 = require("./core/http");
Object.defineProperty(exports, "HttpClient", { enumerable: true, get: function () { return http_1.HttpClient; } });
// Configuration
__exportStar(require("./config"), exports);
// Types
__exportStar(require("./types"), exports);
// Utilities
__exportStar(require("./utils"), exports);
// Errors
__exportStar(require("./errors"), exports);
// Default export
var sdk_2 = require("./core/sdk");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return sdk_2.PolynomialSDK; } });
//# sourceMappingURL=index.js.map