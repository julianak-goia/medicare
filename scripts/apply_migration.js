const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const { Client } = require("pg");

async function run() {
  const sqlPath = path.resolve(
    __dirname,
    "..",
    "drizzle",
    "0004_add_patients_fields.sql",
  );
  if (!fs.existsSync(sqlPath)) {
    console.error("SQL file not found:", sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, "utf8");

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL not found in .env");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to database, executing SQL...");
    await client.query(sql);
    console.log("Migration applied successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run();
