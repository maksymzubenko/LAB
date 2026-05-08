const fs = require("fs");
const path = require("path");
const db = require("./db/db");

const schema = fs.readFileSync(
  path.join(__dirname, "./db/schema.sql"),
  "utf-8"
);

db.exec(schema);

const express = require("express");
const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});


app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms`);
  });

  next();
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

let users = [];
let nextUserId = 1;

app.get("/api/v1/users", (req, res) => {
  res.json(users);
});

app.post("/api/v1/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ error: "Name must be at least 2 characters" });
  }

  const user = {
    id: nextUserId++,
    name,
    email
  };

  users.push(user);
  res.status(201).json(user);
});

app.get("/api/v1/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
});

app.put("/api/v1/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) return res.status(404).json({ error: "User not found" });

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.json(user);
});

app.delete("/api/v1/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) return res.status(404).json({ error: "User not found" });

  users.splice(index, 1);
  res.status(204).send();
});

app.post("/api/v1/passes", (req, res) => {
  const { user, reason, date, comment } = req.body;

  const sql = `
    INSERT INTO passes (user, reason, date, comment)
    VALUES ('${user}', '${reason}', '${date}', '${comment}')
  `;

  db.run(sql, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const passId = this.lastID;

    db.run(`
      INSERT INTO pass_logs (passId, action, createdAt)
      VALUES (${passId}, 'CREATED', '${new Date().toISOString()}')
    `);

    res.status(201).json({
      id: passId,
      user,
      reason,
      date,
      comment
    });
  });
});

app.get("/api/v1/passes", (req, res) => {
  const { sort = "id", order = "ASC", user } = req.query;

  let sql = "SELECT * FROM passes";

  if (user) {
    sql += ` WHERE user = '${user}'`;
  }

  sql += ` ORDER BY ${sort} ${order}`;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

app.get("/api/v1/passes-with-logs", (req, res) => {
  const sql = `
    SELECT passes.*, pass_logs.action, pass_logs.createdAt
    FROM passes
    LEFT JOIN pass_logs ON passes.id = pass_logs.passId
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

app.get("/api/v1/passes/count", (req, res) => {
  db.get("SELECT COUNT(*) as total FROM passes", (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(row);
  });
});

app.get("/api/v1/passes/:id", (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM passes WHERE id = ${id}`, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Pass not found" });

    res.json(row);
  });
});

app.put("/api/v1/passes/:id", (req, res) => {
  const id = req.params.id;
  const { user, reason, date, comment } = req.body;

  const sql = `
    UPDATE passes
    SET user='${user}', reason='${reason}', date='${date}', comment='${comment}'
    WHERE id=${id}
  `;

  db.run(sql, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ id, user, reason, date, comment });
  });
});

app.delete("/api/v1/passes/:id", (req, res) => {
  const id = req.params.id;

  db.run(`DELETE FROM passes WHERE id = ${id}`, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(204).send();
  });
});

app.get("/api/passes/search", (req, res) => {
  const { user } = req.query;

  const sql = `
    SELECT * FROM passes
    WHERE user = '${user}'
    ORDER BY date DESC
    LIMIT 5
  `;

  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/seed", (req, res) => {
  db.run(`
    INSERT INTO passes (user, reason, date, comment)
    VALUES 
    ('Max', 'Sick', '2026-04-03', 'Flu'),
    ('Alex', 'Vacation', '2026-04-04', 'Trip'),
    ('John', 'Work', '2026-04-05', 'Remote')
  `);

  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  console.error(err);
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