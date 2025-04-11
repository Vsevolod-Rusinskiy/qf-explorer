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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var api_1 = require("@polkadot/api");
var dotenv = __importStar(require("dotenv"));
var fs = __importStar(require("fs"));
dotenv.config();
// Настройки
var RPC_ENDPOINT = process.env.RPC_QF_WS || 'wss://dev.qfnetwork.xyz/wss';
var LOG_FILE = './block-check.log';
// Функция для логирования
var log = function (message) {
    var timestamp = new Date().toISOString();
    var logMessage = "[".concat(timestamp, "] ").concat(message);
    console.log(logMessage);
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
};
// Создаем новый лог-файл
fs.writeFileSync(LOG_FILE, '--- Начало проверки блоков ---\n');
// Переменная для хранения id запросов
var requestId = 1;
// Функция для отправки JSON-RPC запроса
function sendRpcRequest(ws, method, params = []) {
    return new Promise(function (resolve, reject) {
        var id = requestId++;
        var request = {
            jsonrpc: '2.0',
            id: id,
            method: method,
            params: params
        };
        var listener = function (message) {
            var response = JSON.parse(message.toString());
            if (response.id === id) {
                ws.removeListener('message', listener);
                if (response.error) {
                    reject(response.error);
                }
                else {
                    resolve(response.result);
                }
            }
        };
        ws.on('message', listener);
        ws.send(JSON.stringify(request));
    });
}
// Главная функция
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var ws, chain, name, version, finalizedHash, finalizedHeader, finalizedBlockNumber, stepSize, blockNumbers, i, blockNumber, blockHash, block, runtime, error_1, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log("Connecting to ".concat(RPC_ENDPOINT, "..."));
                    ws = new WebSocket(RPC_ENDPOINT);
                    return [4 /*yield*/, new Promise(function (resolve) {
                            ws.on('open', resolve);
                        })];
                case 1:
                    _a.sent();
                    log('Connected to the node');
                    return [4 /*yield*/, sendRpcRequest(ws, 'system_chain')];
                case 2:
                    chain = _a.sent();
                    return [4 /*yield*/, sendRpcRequest(ws, 'system_name')];
                case 3:
                    name = _a.sent();
                    return [4 /*yield*/, sendRpcRequest(ws, 'system_version')];
                case 4:
                    version = _a.sent();
                    log("Chain: ".concat(chain, ", Node: ").concat(name, " v").concat(version));
                    return [4 /*yield*/, sendRpcRequest(ws, 'chain_getFinalizedHead')];
                case 5:
                    finalizedHash = _a.sent();
                    log("Finalized head: ".concat(finalizedHash));
                    return [4 /*yield*/, sendRpcRequest(ws, 'chain_getHeader', [finalizedHash])];
                case 6:
                    finalizedHeader = _a.sent();
                    finalizedBlockNumber = parseInt(finalizedHeader.number, 16);
                    log("Finalized block number: ".concat(finalizedBlockNumber));
                    stepSize = 10000;
                    blockNumbers = [];
                    // Создаем массив номеров блоков для проверки
                    for (i = finalizedBlockNumber; i > 0; i -= stepSize) {
                        blockNumbers.push(i);
                        if (blockNumbers.length >= 10)
                            break; // Ограничиваем количество проверок
                    }
                    log("Will check state availability for blocks: ".concat(blockNumbers.join(', ')));
                    return [4 /*yield*/, blockNumbers];
                case 7:
                    blockNumbers = _a.sent();
                    _a.label = 8;
                case 8:
                    if (!(_a.sent().length > 0)) return [3 /*break*/, 19];
                    blockNumber = blockNumbers[_a.label - 8];
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 17, , 18]);
                    return [4 /*yield*/, sendRpcRequest(ws, 'chain_getBlockHash', [blockNumber])];
                case 10:
                    blockHash = _a.sent();
                    log("Block #".concat(blockNumber, " hash: ").concat(blockHash));
                    return [4 /*yield*/, sendRpcRequest(ws, 'chain_getBlock', [blockHash])];
                case 11:
                    block = _a.sent();
                    log("Block #".concat(blockNumber, " retrieved successfully"));
                    _a.label = 12;
                case 12:
                    _a.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, sendRpcRequest(ws, 'state_getRuntimeVersion', [blockHash])];
                case 13:
                    runtime = _a.sent();
                    log("Block #".concat(blockNumber, " runtime version: ").concat(runtime.specVersion, ", state is AVAILABLE"));
                    return [3 /*break*/, 15];
                case 14:
                    error_1 = _a.sent();
                    log("Block #".concat(blockNumber, " state NOT AVAILABLE: ").concat(error_1.message));
                    return [3 /*break*/, 15];
                case 15:
                    _a.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, sendRpcRequest(ws, 'state_getStorageAt', ['0x26aa394eea5630e07c48ae0c9558cef780d41e5e16056765bc8461851072c9d7', blockHash])];
                case 16:
                    log("Block #".concat(blockNumber, " storage: available, state is AVAILABLE"));
                    return [3 /*break*/, 18];
                case 17:
                    error_2 = _a.sent();
                    log("Block #".concat(blockNumber, " storage NOT AVAILABLE: ").concat(error_2.message));
                    return [3 /*break*/, 18];
                case 18:
                    _a.label = 8;
                    return [3 /*break*/, 8];
                case 19:
                    log('Check completed');
                    return [4 /*yield*/, ws.close()];
                case 20:
                    _a.sent();
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
// Запуск скрипта
main().catch(function (error) {
    console.error('Fatal error:', error);
    process.exit(1);
});
