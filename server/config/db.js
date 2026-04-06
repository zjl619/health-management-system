const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'health-app.sqlite');
const WASM_FILE = require.resolve('sql.js/dist/sql-wasm.wasm');

let SQL = null;
let db = null;
let initializing = null;

async function loadSqlJs() {
  if (SQL) {
    return SQL;
  }
  SQL = await initSqlJs({
    locateFile(file) {
      if (file.endsWith('.wasm')) {
        return WASM_FILE;
      }
      return file;
    },
  });
  return SQL;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      openid TEXT NOT NULL UNIQUE,
      nickname TEXT NOT NULL DEFAULT '微信用户',
      avatar TEXT NOT NULL DEFAULT '',
      gender TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS health_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      timestamp INTEGER NOT NULL,
      temp REAL NOT NULL,
      status TEXT NOT NULL,
      exercise INTEGER NOT NULL DEFAULT 0,
      sleep REAL NOT NULL DEFAULT 0,
      water INTEGER NOT NULL DEFAULT 0,
      mood TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS diet_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      food_id INTEGER NOT NULL,
      food_name TEXT NOT NULL,
      grams INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL NOT NULL,
      carbs REAL NOT NULL,
      fat REAL NOT NULL,
      meal TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_diet_date ON diet_entries(date);

    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL,
      unit_weight INTEGER NOT NULL,
      cal_per100 REAL NOT NULL,
      pro_per100 REAL NOT NULL,
      carb_per100 REAL NOT NULL,
      fat_per100 REAL NOT NULL
    );
  `);
}

function persistDb() {
  if (!db) {
    return;
  }
  fs.writeFileSync(DB_FILE, Buffer.from(db.export()));
}

async function getPool() {
  if (db) {
    return db;
  }

  if (initializing) {
    return initializing;
  }

  initializing = (async () => {
    ensureDataDir();
    const SQLite = await loadSqlJs();
    if (fs.existsSync(DB_FILE)) {
      db = new SQLite.Database(fs.readFileSync(DB_FILE));
    } else {
      db = new SQLite.Database();
    }

    db.run('PRAGMA foreign_keys = ON;');
    initSchema();
    persistDb();
    console.log('[DB] SQLite 数据库已就绪');
    return db;
  })();

  try {
    return await initializing;
  } finally {
    initializing = null;
  }
}

function bindStatement(stmt, params = []) {
  if (Array.isArray(params)) {
    stmt.bind(params);
  } else {
    stmt.bind(params);
  }
}

async function run(sql, params = []) {
  const dbInstance = await getPool();
  try {
    dbInstance.run(sql, params);
    const changes = dbInstance.getRowsModified();
    persistDb();
    return { changes };
  } catch (err) {
    throw err;
  }
}

async function all(sql, params = []) {
  const dbInstance = await getPool();
  const stmt = dbInstance.prepare(sql);
  try {
    bindStatement(stmt, params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    return rows;
  } finally {
    stmt.free();
  }
}

async function get(sql, params = []) {
  const rows = await all(sql, params);
  return rows[0] || null;
}

async function closePool() {
  if (!db) {
    return;
  }
  persistDb();
  db.close();
  db = null;
}

module.exports = { getPool, run, all, get, closePool };
