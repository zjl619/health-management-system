-- ================================================
-- 健康打卡小程序 - SQLite 用户表迁移脚本
-- 当前后端启动时会自动创建 users 表。
-- 如需手工迁移，可执行下面的语句。
-- ================================================

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  openid TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL DEFAULT '微信用户',
  avatar TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
