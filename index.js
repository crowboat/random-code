"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require('readline');
// Function to parse the data file line by line
function parseDataFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var productsMap = new Map();
                    var inputStream = fs.createReadStream(filePath);
                    var lineReader = readline.createInterface({
                        input: inputStream,
                        crlfDelay: Infinity
                    });
                    lineReader.on('line', function (line) {
                        var productData = JSON.parse(line);
                        var asin = productData.asin, helpful = productData.helpful;
                        var aggregateScore = 0;
                        if (!productsMap.has(asin)) {
                            productsMap.set(asin, { asin: asin, helpful: [helpful], aggregateScore: aggregateScore });
                        }
                        else {
                            var existingProduct = productsMap.get(asin);
                            existingProduct.helpful = existingProduct.helpful.concat(helpful);
                            productsMap.set(asin, existingProduct);
                        }
                    });
                    lineReader.on('close', function () {
                        var products = Array.from(productsMap.values());
                        resolve(products);
                    });
                    lineReader.on('error', function (error) {
                        reject(error);
                    });
                })];
        });
    });
}
function calculateAggregateScores(products) {
    return products.map(function (product) {
        var aggregateScore = product.helpful.reduce(function (total, currentValue) { return total + currentValue; });
        return __assign(__assign({}, product), { aggregateScore: aggregateScore });
    });
}
function sortProducts(products) {
    return products.sort(function (a, b) {
        if (a.aggregateScore !== b.aggregateScore) {
            return b.aggregateScore - a.aggregateScore;
        }
        else {
            return products.filter(function (product) { return product.asin === b.asin; }).length - products.filter(function (product) { return product.asin === a.asin; }).length;
        }
    });
}
// Main function
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, products, productsWithAggregateScores, sortedProducts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = 'helpful-reviews.json';
                    return [4 /*yield*/, parseDataFile(filePath)];
                case 1:
                    products = _a.sent();
                    productsWithAggregateScores = calculateAggregateScores(products);
                    sortedProducts = sortProducts(productsWithAggregateScores);
                    sortedProducts.forEach(function (product) {
                        console.log("ASIN: ".concat(product.asin, ", Aggregate Scoe: ").concat(product.aggregateScore));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Run the main function
main();
