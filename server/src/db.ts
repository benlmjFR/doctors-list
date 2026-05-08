import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT) || 5433,
  user: process.env.DB_USER ?? "admin",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_NAME ?? "doctors_db",
});

export default pool;
