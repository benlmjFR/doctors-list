import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5433,
  user: "admin",
  password: "password",
  database: "doctors_db",
});

export default pool;
