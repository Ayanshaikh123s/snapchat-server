const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000; // ✅ Render auto-port

app.use(cors());
app.use(express.json());

// ✅ Serve Frontend from /public
app.use(express.static(path.join(__dirname, "public")));

const usersFile = path.join(__dirname, "users.json");

// ✅ LOGIN API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Missing details!" });
  }

  try {
    let users = [];

    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, "utf8");
      users = JSON.parse(data);
    }

    users.push({
      username,
      password,
      time: new Date().toLocaleString("en-IN"),
    });

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    return res.json({ success: true, message: "✅ Saved Successfully" });
  } catch (err) {
    console.error("Write Error:", err);
    return res.json({ success: false, message: "File Error ❌" });
  }
});

// ✅ DEFAULT ROUTE (Open index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at ${PORT}`);
});
