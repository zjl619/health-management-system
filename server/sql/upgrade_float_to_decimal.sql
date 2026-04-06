-- ================================================
-- 已有数据库升级：FLOAT 改 DECIMAL（避免精度问题）
-- 如果是全新建库，不需要执行此脚本
-- 在 SSMS 中选中全部内容一次执行即可
-- ================================================
USE HealthApp;

-- 先删除有默认值约束的列的约束，再改类型
-- health_records 表
DECLARE @sql1 NVARCHAR(500);
SELECT @sql1 = 'ALTER TABLE health_records DROP CONSTRAINT ' + d.name
FROM sys.default_constraints d
JOIN sys.columns c ON d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id
WHERE d.parent_object_id = OBJECT_ID('health_records') AND c.name = 'sleep';
IF @sql1 IS NOT NULL EXEC(@sql1);

DECLARE @sql2 NVARCHAR(500);
SELECT @sql2 = 'ALTER TABLE health_records DROP CONSTRAINT ' + d.name
FROM sys.default_constraints d
JOIN sys.columns c ON d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id
WHERE d.parent_object_id = OBJECT_ID('health_records') AND c.name = 'temp';
IF @sql2 IS NOT NULL EXEC(@sql2);

ALTER TABLE health_records ALTER COLUMN temp  DECIMAL(4,1) NOT NULL;
ALTER TABLE health_records ALTER COLUMN sleep DECIMAL(3,1) NOT NULL;

-- 加回默认值
ALTER TABLE health_records ADD DEFAULT 0 FOR sleep;

-- diet_entries 表（无默认值约束，直接改）
ALTER TABLE diet_entries ALTER COLUMN protein DECIMAL(5,1) NOT NULL;
ALTER TABLE diet_entries ALTER COLUMN carbs   DECIMAL(5,1) NOT NULL;
ALTER TABLE diet_entries ALTER COLUMN fat     DECIMAL(5,1) NOT NULL;

-- foods 表
ALTER TABLE foods ALTER COLUMN cal_per100  DECIMAL(6,1) NOT NULL;
ALTER TABLE foods ALTER COLUMN pro_per100  DECIMAL(5,1) NOT NULL;
ALTER TABLE foods ALTER COLUMN carb_per100 DECIMAL(5,1) NOT NULL;
ALTER TABLE foods ALTER COLUMN fat_per100  DECIMAL(5,1) NOT NULL;

PRINT '精度升级完成！';
