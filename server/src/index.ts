import express from "express";
import cors from "cors";
import pool from "./db";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch {
    res.status(503).json({ error: "Database unavailable" });
  }
});

app.get("/doctors", async (req, res) => {
  const limit = 10;
  const offset = parseInt(req.query.offset as string) || 0;
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;

  const conditions: string[] = [];
  const params: (string | number)[] = [limit, offset];

  if (status && ["active", "retired"].includes(status)) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(first_name ILIKE $${params.length} OR last_name ILIKE $${params.length})`,
    );
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT * FROM doctors
    ${where}
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  try {
    const result = await pool.query(query, params);
    res.status(200).json({ data: result.rows, offset, limit, next: offset + limit });
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/doctors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM doctors WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
