import React, { useEffect, useState } from "react";
import {
  RpcClient,
  ForgeOperationsParams,
  OpKind,
  MichelsonV1Expression
} from "@taquito/rpc";
import "./App.css";
import { TezBridgeSigner } from "@taquito/tezbridge-signer";

const App = () => {
  const [storage, setStorage] = useState(0);
  const [loadingIncrement, setLoadingIncrement] = useState(false);
  const [loadingDecrement, setLoadingDecrement] = useState(false);
  const [opHash, setOpHash] = useState<string>();
  const [incrementValue, setIncrementValue] = useState<number>(0);
  const [decrementValue, setDecrementValue] = useState<number>(0);
  const [client, setClient]: [
    RpcClient | undefined,
    React.Dispatch<React.SetStateAction<RpcClient | undefined>>
  ] = useState<RpcClient>();
  const [pkh, setPkh] = useState<string>();
  const [signer, setSigner] = useState();

  const contractAddress = "KT1Pdsb8cUZkXGxVaXCzo9DntriCEYdG9gWT";
  const rpcUrl = "https://testnet-tezos.giganode.io";

  const increment = async () => {
    // increments the storage by 1
    setLoadingIncrement(true);
    setOpHash(undefined);
    try {
      const res = await fetch("/increment");
      const data = JSON.parse(await res.json());
      console.log({ data });
      if (data.opHash) {
        // hash is returned after first confirmation
        setStorage(storage + 1);
        setOpHash(data.opHash);
      } else {
        throw data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingIncrement(false);
    }
  };

  const decrement = async () => {
    // decrements the storage by 1
    // increments the storage by 1
    setLoadingDecrement(true);
    setOpHash(undefined);
    try {
      const res = await fetch("/decrement");
      const data = JSON.parse(await res.json());
      console.log({ data });
      if (data.opHash) {
        // hash is returned after first confirmation
        setStorage(storage - 1);
        setOpHash(data.opHash);
      } else {
        throw data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDecrement(false);
    }
  };

  const signIncrement = async () => {
    if (pkh && client) {
      // gets operation counter for address
      const req = await fetch(
        `${rpcUrl}/chains/main/blocks/head/context/contracts/${pkh}/counter`
      );
      if (req) {
        let counter = await req.json();
        counter = (+counter + 1).toString();
        // forges the operation
        const blockHash = await client.getBlockHash();
        const value: MichelsonV1Expression = { int: incrementValue.toString() };
        const txData: ForgeOperationsParams = {
          branch: blockHash,
          contents: [
            {
              kind: OpKind.TRANSACTION,
              source: pkh,
              fee: "300000",
              counter,
              gas_limit: "219104",
              storage_limit: "30000",
              amount: "0",
              destination: contractAddress,
              parameters: {
                entrypoint: "increment",
                value
              }
            }
          ]
        };
        const opBytes = await client.forgeOperations(txData);
        //console.log(opBytes);
        // signs the operation bytes
        const signature = await signer.sign(opBytes);
        const response = await fetch(
          `/broadcast?op="inc"&sig=${signature.sbytes}`
        );
        const data = await response.json();
        if (response.status === 200) {
          console.log(data.opHash);
          setOpHash(data.opHash);
        } else {
          console.error(data);
        }
      }
    }
  };

  useEffect(() => {
    (async () => {
      // sets up the RPC client
      const client = new RpcClient(rpcUrl);
      setClient(client);
      // sets up the signer
      const signer = new TezBridgeSigner();
      const pkh = await signer.publicKeyHash();
      setSigner(signer);
      setPkh(pkh);
      // fetches the storage
      const res = await fetch("/storage");
      const data = await res.json();
      const storage = JSON.parse(data);
      if (storage.storage) {
        setStorage(storage.storage);
      }
    })();
  }, []);

  return (
    <main>
      <div className="app">
        <h2>Transactionless Taquito Dapp</h2>
        <h4>Current storage: {storage}</h4>
        <div>{pkh ? <p>{pkh}</p> : <p></p>}</div>
        <div>
          {opHash ? (
            <p>
              Operation hash: <br />
              <a
                href={`https://better-call.dev/carthagenet/opg/${opHash}/contents`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {opHash}
              </a>
            </p>
          ) : (
            <p>
              &nbsp;
              <br />
              &nbsp;
            </p>
          )}
        </div>
        <div className="buttons">
          <button
            className="button"
            disabled={loadingIncrement}
            onClick={increment}
          >
            {loadingIncrement && <div className="icon loader"></div>} Increase
            by 1
          </button>
          <button
            className="button"
            disabled={loadingDecrement}
            onClick={decrement}
          >
            {loadingDecrement && <div className="icon loader"></div>}Decrease by
            1
          </button>
        </div>
        <div className="custom-functions">
          <div>
            <span>Increment by:</span>
            <input
              type="text"
              value={incrementValue}
              onChange={e => {
                const val = e.target.value;
                if (!isNaN(+val)) {
                  setIncrementValue(+val.slice(0, 3));
                } else {
                  setIncrementValue(0);
                }
              }}
            />
            <button className="button" onClick={signIncrement}>
              Confirm
            </button>
          </div>
          <div>
            <span>Decrement by:</span>
            <input
              type="text"
              value={decrementValue}
              onChange={e => {
                const val = e.target.value;
                if (!isNaN(+val)) {
                  setDecrementValue(+val.slice(0, 3));
                } else {
                  setDecrementValue(0);
                }
              }}
            />
            <button className="button">Confirm</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
