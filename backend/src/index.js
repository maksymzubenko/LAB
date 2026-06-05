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

app.use((req,res,next)=>{

  res.setHeader(
    "X-Content-Type-Options",
    "nosniff"
  );

  res.setHeader(
    "X-Frame-Options",
    "DENY"
  );

  res.setHeader(
    "Referrer-Policy",
    "no-referrer"
  );

  next();

});

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

 res.header(
  "Access-Control-Allow-Headers",
  "Content-Type, X-Demo-UserId"
);
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

function demoAuth(req, res, next) {

  const userId = req.header("X-Demo-UserId");

  if (!userId) {
    return res.status(401).json({
      code:"UNAUTHORIZED",
      message:"Login required"
    });
  }

  const id = Number(userId);

  if (isNaN(id)) {
    return res.status(401).json({
      code:"INVALID_USER",
      message:"Invalid user id"
    });
  }

  req.user = {
    id
  };

  next();

}

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

app.put("/api/v1/users/:id", demoAuth, (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) return res.status(404).json({ error: "User not found" });

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.json(user);
});

app.delete("/api/v1/users/:id", demoAuth, (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) return res.status(404).json({ error: "User not found" });

  users.splice(index, 1);
  res.status(204).send();
});

app.post("/api/v1/passes", demoAuth, (req, res) => {

  const { user, reason, date, comment } = req.body;

  const sql = `
    INSERT INTO passes
    (user, reason, date, comment, ownerUserId)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      user,
      reason,
      date,
      comment,
      req.user.id
    ],
    function(err){

      if (err) {
        return res.status(400).json({
          error: err.message
        });
      }

      const passId=this.lastID;

      db.run(
        `
        INSERT INTO pass_logs
        (passId,action,createdAt)
        VALUES(?,?,?)
        `,
        [
          passId,
          "CREATED",
          new Date().toISOString()
        ]
      );

      res.status(201).json({
        id:passId,
        user,
        reason,
        date,
        comment
      });

    }
  );

});

app.get("/api/v1/passes", (req, res) => {

  const { sort = "id", order = "ASC", user } = req.query;

  let sql = "SELECT * FROM passes";
  const params = [];

  if (user) {
    sql += " WHERE user=?";
    params.push(user);
  }

  sql += ` ORDER BY ${sort} ${order}`;

  db.all(sql, params, (err, rows) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
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

app.get("/api/v1/passes/top-users", (req, res) => {

  const sql = `
    SELECT
      user,
      COUNT(*) AS total
    FROM passes
    GROUP BY user
    ORDER BY total DESC
    LIMIT 3
  `;

  db.all(sql, (err, rows) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);

  });

});

app.get("/api/v1/passes/:id", demoAuth, (req, res) => {

  const sql = `
    SELECT *
    FROM passes
    WHERE id=?
    AND ownerUserId=?
  `;

  console.log(
  "req.params.id =",
  req.params.id
);

  db.get(
    sql,
    [
      req.params.id,
      req.user.id
    ],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          code: "SERVER_ERROR",
          message: err.message
        });
      }

      if (!row) {
        return res.status(404).json({
          code: "NOT_FOUND",
          message: "Pass not found"
        });
      }

      res.json(row);

    }
  );

});

app.put("/api/v1/passes/:id", demoAuth, (req,res)=>{

  const {user,reason,date,comment}=req.body;

  const sql=`
  UPDATE passes
  SET user=?,
      reason=?,
      date=?,
      comment=?
  WHERE id=?
  AND ownerUserId=?
  `;

  db.run(
    sql,
    [
      user,
      reason,
      date,
      comment,
      req.params.id,
      req.user.id
    ],
    function(err){

      if(err){
        return res.status(500).json({
          error:err.message
        });
      }

      res.json({
        ok:true
      });

    }
  );

});

app.delete("/api/v1/passes/:id", demoAuth, (req,res)=>{

  db.run(
    `
    DELETE FROM passes
    WHERE id=?
    AND ownerUserId=?
    `,
    [
      req.params.id,
      req.user.id
    ],
    function(err){

      if(err){
        return res.status(500).json({
          code:"SERVER_ERROR",
          message:err.message
        });
      }

      if(this.changes===0){
        return res.status(404).json({
          code:"NOT_FOUND",
          message:"Pass not found or access denied"
        });
      }

      res.status(204).send();

    }
  );

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
INSERT INTO passes
(user,reason,date,comment,ownerUserId)
VALUES
('Максим','Study','2026-05-22','Тест',1),
('Ігор','Study','2026-05-23','Тест',2),
('Антон','Study','2026-05-24','Тест',1)
`);

res.json({
ok:true
});

});

app.use((err, req, res, next) => {

  console.error(err);

  const isDev = process.env.NODE_ENV !== "production";

  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Internal server error",
    details: isDev ? err.message : undefined
  });

});

app.listen(3000, () => {
  console.log("Server started http://localhost:3000");
});
