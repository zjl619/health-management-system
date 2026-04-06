-- ================================================
-- 健康打卡小程序 - SQLite 初始化脚本
-- 说明：当前后端会在启动时自动创建本地 SQLite 文件。
-- 这个脚本仅用于手工查看或离线初始化参考。
-- ================================================

PRAGMA foreign_keys = ON;

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
