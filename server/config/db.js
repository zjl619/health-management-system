const sql = require('mssql');

const dbConfig = {
  server: '10.138.78.82',
  user: 'sa',
  password: '1324657980',
  database: 'HealthApp',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
  }
  return pool;
}

module.exports = { sql, getPool };
