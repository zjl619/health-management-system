const sql = require('mssql');

// 支持环境变量覆盖，默认值用于本地开发
const dbConfig = {
  server: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASS || '1324657980',
  database: process.env.DB_NAME || 'HealthApp',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 15000,
  },
  requestTimeout: 10000,
  connectionTimeout: 10000,
};

let pool = null;
let connecting = false;

async function getPool() {
  // 连接池存在且健康，直接返回
  if (pool && pool.connected) {
    return pool;
  }

  // 防止并发重复创建
  if (connecting) {
    await _wait(200);
    return getPool();
  }

  connecting = true;
  try {
    // 如果旧连接池存在但已断开，先关闭
    if (pool) {
      try { await pool.close(); } catch (_) {}
      pool = null;
    }
    pool = await sql.connect(dbConfig);

    // 监听连接池错误，自动清除失效连接
    pool.on('error', (err) => {
      console.error('[DB] 连接池异常，将在下次请求时重连:', err.message);
      pool = null;
    });

    console.log('[DB] 数据库连接成功');
    return pool;
  } catch (err) {
    pool = null;
    throw err;
  } finally {
    connecting = false;
  }
}

function _wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 优雅关闭
async function closePool() {
  if (pool) {
    try { await pool.close(); } catch (_) {}
    pool = null;
  }
}

module.exports = { sql, getPool, closePool };
