const express = require("express");
const isWord = require("is-word");
const app = express();
const PORT = 3000;

app.get("/validate-word", (req, res) => {
  const { word } = req.query;

  if (word && word.length >= 5 && isWord(word)) {
    const lastLetter = word[word.length - 1];
    res.json({ result: lastLetter });
  } else {
    res
      .status(400)
      .json({
        error:
          "Invalid word. Please provide a valid English word with at least 5 characters.",
      });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
