"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taquito_1 = require("@taquito/taquito");
const signer_1 = require("@taquito/signer");
const faucet_1 = __importDefault(require("./faucet"));
const app = express_1.default();
const contractAddress = "KT1Pdsb8cUZkXGxVaXCzo9DntriCEYdG9gWT";
taquito_1.Tezos.setProvider({
    rpc: "https://carthagenet.smartpy.io",
    signer: new signer_1.InMemorySigner(faucet_1.default.sk)
});
app.get("/storage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contract = yield taquito_1.Tezos.contract.at(contractAddress);
    const storage = yield contract.storage();
    res.json(JSON.stringify({ storage }));
}));
app.get("/increment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = yield taquito_1.Tezos.contract.at(contractAddress);
        const op = yield contract.methods.increment(1).send();
        yield op.confirmation();
        res.json(JSON.stringify({ opHash: op.hash }));
    }
    catch (error) {
        console.log(error);
        res.status(500).json(JSON.stringify({ error: error }));
    }
}));
app.get("/decrement", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = yield taquito_1.Tezos.contract.at(contractAddress);
        const op = yield contract.methods.decrement(1).send();
        yield op.confirmation();
        res.json(JSON.stringify({ opHash: op.hash }));
    }
    catch (error) {
        console.log(error);
        res.status(500).json(JSON.stringify({ error: error }));
    }
}));
const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
