"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.get("/hello", (req, res) => {
    res.json(JSON.stringify({ res: "hello" }));
});
const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
