import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [storage, setStorage] = useState(0);
  const [loadingIncrement, setLoadingIncrement] = useState(false);
  const [loadingDecrement, setLoadingDecrement] = useState(false);
  const [opHash, setOpHash] = useState<string>();

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

  useEffect(() => {
    (async () => {
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
        <h2>Walletless Taquito Dapp</h2>
        <h4>Current storage: {storage}</h4>
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
      </div>
    </main>
  );
};

export default App;
