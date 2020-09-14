const express = require("express");

const app = express();

app.get("/hello", (req, res) => {
  res.json(JSON.stringify({ res: "hello" }));
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
