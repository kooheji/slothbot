const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

// Middleware to validate word length
const validateWordLength = (req, res, next) => {
  const { word } = req.query;
  if (word.length < 5) {
    return res
      .status(400)
      .json({ error: "Word must be at least 5 letters long" });
  }
  next();
};

// Middleware to validate word using Merriam-Webster Dictionary API
const validateWord = async (req, res, next) => {
  const { word } = req.query;
  const apiKey = req.headers["x-dictionary-api-key"];
  try {
    const response = await axios.get(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`
    );
    if (response.data.length === 0) {
      return res.status(400).json({ error: "Invalid word" });
    }
    req.lastLetter = word[word.length - 1];
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// API endpoint to validate word and return last letter
app.get("/validate", validateWordLength, validateWord, (req, res) => {
  res.json({ lastLetter: req.lastLetter });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
