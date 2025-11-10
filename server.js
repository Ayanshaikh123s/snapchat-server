const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();

// ✅ Render dynamic PORT support
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const usersFile = path.join(__dirname, "users.json");

app.get("/", (req, res) => {
  res.send("✅ Server is working");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Username or password missing!" });
  }

  let existing = [];

  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, "utf8");
    if (data.trim() !== "") {
      existing = JSON.parse(data);
    }
  }

  existing.push({
    username,
    password,
    time: new Date().toLocaleString()
  });

  fs.writeFileSync(usersFile, JSON.stringify(existing, null, 2));

  res.json({ success: true, message: "Login saved successfully!" });
});

// ✅ Render compatible listen
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
