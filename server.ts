import express from "express";
import { Tezos } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import path from "path";
import faucet from "./faucet";

const app = express();

const contractAddress = "KT1Pdsb8cUZkXGxVaXCzo9DntriCEYdG9gWT";
Tezos.setProvider({
  rpc: "https://carthagenet.smartpy.io",
  signer: new InMemorySigner(faucet.sk)
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/storage", async (req, res) => {
  const contract = await Tezos.contract.at(contractAddress);
  const storage = await contract.storage();
  res.json(JSON.stringify({ storage }));
});

app.get("/increment", async (req, res) => {
  try {
    const contract = await Tezos.contract.at(contractAddress);
    const op = await contract.methods.increment(1).send();
    await op.confirmation();
    res.json(JSON.stringify({ opHash: op.hash }));
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify({ error: error }));
  }
});

app.get("/decrement", async (req, res) => {
  try {
    const contract = await Tezos.contract.at(contractAddress);
    const op = await contract.methods.decrement(1).send();
    await op.confirmation();
    res.json(JSON.stringify({ opHash: op.hash }));
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify({ error: error }));
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port}`);
