import React, { useEffect } from "react";
import "./App.css";

const App = () => {
  useEffect(() => {
    (async () => {
      const data = await fetch("/storage");
      const storage = await data.json();
      console.log(storage);
    })();
  }, []);

  return <div>Walletless Taquito Dapp</div>;
};

export default App;
