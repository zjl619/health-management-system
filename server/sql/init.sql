-- ================================================
-- 健康打卡小程序 - 数据库初始化脚本
-- 使用方法：在 SSMS 中分两步执行
-- ================================================

-- ============================
-- 第一步：先选中下面这一行，单独执行
-- ============================
CREATE DATABASE HealthApp;

-- ============================
-- 第二步：执行完上面后，选中下面全部内容执行
-- ============================
USE HealthApp;

-- 健康打卡记录表
CREATE TABLE health_records (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    date      NVARCHAR(10)   NOT NULL UNIQUE,
    timestamp BIGINT         NOT NULL,
    temp      FLOAT          NOT NULL,
    status    NVARCHAR(20)   NOT NULL,
    exercise  INT            NOT NULL DEFAULT 0,
    sleep     FLOAT          NOT NULL DEFAULT 0,
    water     INT            NOT NULL DEFAULT 0,
    mood      NVARCHAR(10)   NOT NULL DEFAULT '',
    note      NVARCHAR(500)  NOT NULL DEFAULT ''
);

-- 饮食记录表
CREATE TABLE diet_entries (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    date      NVARCHAR(10)   NOT NULL,
    food_id   INT            NOT NULL,
    food_name NVARCHAR(50)   NOT NULL,
    grams     INT            NOT NULL,
    calories  INT            NOT NULL,
    protein   FLOAT          NOT NULL,
    carbs     FLOAT          NOT NULL,
    fat       FLOAT          NOT NULL,
    meal      NVARCHAR(10)   NOT NULL
);
CREATE INDEX idx_diet_date ON diet_entries(date);

-- 食物库表（可选，当前食物数据内置在前端）
CREATE TABLE foods (
    id          INT PRIMARY KEY,
    name        NVARCHAR(50)   NOT NULL,
    category    NVARCHAR(20)   NOT NULL,
    unit        NVARCHAR(30)   NOT NULL,
    unit_weight INT            NOT NULL,
    cal_per100  FLOAT          NOT NULL,
    pro_per100  FLOAT          NOT NULL,
    carb_per100 FLOAT          NOT NULL,
    fat_per100  FLOAT          NOT NULL
);

PRINT '建表完成！';
