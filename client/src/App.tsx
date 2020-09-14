import React, { useEffect } from "react";
import "./App.css";

const App = () => {
  useEffect(() => {
    (async () => {
      const data = await fetch("/hello");
      const text = await data.json();
      console.log(text);
    })();
  }, []);

  return <div>Walletless Taquito Dapp</div>;
};

export default App;
