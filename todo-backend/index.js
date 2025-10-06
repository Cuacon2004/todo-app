const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Lấy tất cả todos
app.get("/api/todos", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Thêm todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  db.run("INSERT INTO todos (text) VALUES (?)", [text], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, text, completed: 0 });
  });
});

// Xóa todo
app.delete("/api/todos/:id", (req, res) => {
  db.run("DELETE FROM todos WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Cập nhật todo (chỉnh sửa + hoàn thành)
app.put("/api/todos/:id", (req, res) => {
  const { text, completed } = req.body;
  db.run(
    "UPDATE todos SET text = ?, completed = ? WHERE id = ?",
    [text, completed ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, text, completed });
    }
  );
});

app.listen(4000, () => console.log("✅ Backend running on http://localhost:4000"));
