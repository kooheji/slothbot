const express = require("express");
const checkWord = require("check-dictionary-word");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
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

app.post("/updateScore", async (req, res) => {
  const { userId, score } = req.body;
  const { host, user, password, database } = req.headers;

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
    });
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE userId = ?",
      [userId]
    );

    if (rows.length > 0) {
      let currentScore = rows[0].score;
      if (score < 0) {
        currentScore -= Math.abs(score);
      } else {
        currentScore += score;
      }
      await connection.execute("UPDATE users SET score = ? WHERE userId = ?", [
        currentScore,
        userId,
      ]);
    } else {
      await connection.execute(
        "INSERT INTO users (userId, score) VALUES (?, ?)",
        [userId, score]
      );
    }

    res.status(200).send("Score updated successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
