const express = require("express");
const checkWord = require("check-dictionary-word");
const app = express();
const PORT = 3000;

app.get("/validate-word/:word", (req, res) => {
  const { word } = req.params;

  if (word.length < 5) {
    return res
      .status(400)
      .json({ error: "Word must be at least 5 letters long" });
  }

  if (!checkWord(word)) {
    return res.status(400).json({ error: "Not a valid English word" });
  }

  const lastLetter = word[word.length - 1];
  res.json({ result: `${lastLetter}` });
});

app.get("/ping", (req, res) => {
  const startTime = Date.now();
  res.json({ message: "Pong!", latency: Date.now() - startTime + "ms" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
