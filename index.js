const express = require("express");
const app = express();
const dictionary = require("dictionary-en");

app.get("/validate-word", (req, res) => {
  const { word } = req.query;

  if (word && word.length >= 5) {
    dictionary(word, (valid) => {
      if (valid) {
        const lastLetter = word[word.length - 1];
        res.json({ result: lastLetter });
      } else {
        res.status(400).json({ error: "Not a valid English word" });
      }
    });
  } else {
    res.status(400).json({ error: "Word must be at least 5 letters long" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
