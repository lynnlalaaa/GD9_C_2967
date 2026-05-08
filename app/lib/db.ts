import postgres, { type Sql } from 'postgres';

let sql: Sql | null = null;

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_URL is not set.');
  }

  return connectionString;
}

export function getSql() {
  if (!sql) {
    sql = postgres(getConnectionString(), { ssl: 'require' });
  }

  return sql;
}
