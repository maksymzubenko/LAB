const express = require("express");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE");
  next();
});

let users = [];
let nextUserId = 1;

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });

  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/api/users", (req, res) => {
  res.status(200).json(users);
});

app.post("/api/users", (req, res) => {  
  const { name, email } = req.body;  
  
  if (!name || name.length < 2) {  
    return res.status(400).json({
      error: "Name must be at least 2 characters"
    });
  }

  const user = {
    id: nextUserId++,
    name,
    email
  };

  users.push(user);

  res.status(201).json(user);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  res.status(200).json(user);
});

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  users.splice(index, 1);

  res.status(204).send();
});

let passes = [];
let nextPassId = 1;

app.post("/api/passes", (req, res) => {

  const { user, reason, date, comment } = req.body;

  if (!user || user.length < 3) {
    return res.status(400).json({
      error: "User must be at least 3 characters"
    });
  }

  const pass = {
    id: nextPassId++,
    user,
    reason,
    date,
    comment
  };

  passes.push(pass);

  res.status(201).json(pass);
});

app.put("/api/users/:id", (req, res) => {

  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { name, email } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;

  res.status(200).json(user);
});

app.get("/api/passes", (req, res) => {
  res.status(200).json(passes);
});

app.get("/api/passes/:id", (req, res) => {

  const id = Number(req.params.id);

  const pass = passes.find(p => p.id === id);

  if (!pass) {
    return res.status(404).json({
      error: "Pass not found"
    });
  }

  res.status(200).json(pass);
});

app.put("/api/passes/:id", (req, res) => {

  const id = Number(req.params.id);

  const pass = passes.find(p => p.id === id);

  if (!pass) {
    return res.status(404).json({
      error: "Pass not found"
    });
  }

  const { user, reason, date, comment } = req.body;

  if (user) pass.user = user;
  if (reason) pass.reason = reason;
  if (date) pass.date = date;
  if (comment) pass.comment = comment;

  res.status(200).json(pass);
});

app.delete("/api/passes/:id", (req, res) => {

  const id = Number(req.params.id);

  const index = passes.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Pass not found"
    });
  }

  passes.splice(index, 1);

  res.status(204).send();
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }
  });
});

app.listen(3000, () => {
  console.log("Server started http://localhost:3000");
});
