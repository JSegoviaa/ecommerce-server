import { Pool } from 'pg';

const keys = {
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_POSRT,
  user: process.env.DATABASE_USER,
};

const { database, host, password, port, user } = keys;

export const db = new Pool({
  database,
  host,
  password,
  port: Number(port),
  user,
  ssl: { rejectUnauthorized: false },
});
