import express from "express";
import { Tezos } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import faucet from "./faucet";

const app = express();

const contractAddress = "KT1Pdsb8cUZkXGxVaXCzo9DntriCEYdG9gWT";
Tezos.setProvider({
  rpc: "https://carthagenet.smartpy.io",
  signer: new InMemorySigner(faucet.sk)
});

app.get("/storage", async (req, res) => {
  const contract = await Tezos.contract.at(contractAddress);
  const storage = await contract.storage();
  res.json(JSON.stringify({ storage }));
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
