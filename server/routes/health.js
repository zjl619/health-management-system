const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// 获取所有健康记录
router.get('/records', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      'SELECT * FROM health_records ORDER BY date ASC'
    );
    res.json({ code: 0, data: result.recordset });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

// 获取指定日期的记录
router.get('/records/:date', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('date', sql.NVarChar, req.params.date)
      .query('SELECT * FROM health_records WHERE date = @date');
    res.json({ code: 0, data: result.recordset[0] || null });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

// 新增或更新记录（upsert）
router.post('/records', async (req, res) => {
  try {
    const { date, timestamp, temp, status, exercise, sleep, water, mood, note } = req.body;
    const pool = await getPool();
    // 先查是否存在
    const existing = await pool.request()
      .input('date', sql.NVarChar, date)
      .query('SELECT id FROM health_records WHERE date = @date');

    if (existing.recordset.length > 0) {
      await pool.request()
        .input('date', sql.NVarChar, date)
        .input('timestamp', sql.BigInt, timestamp)
        .input('temp', sql.Float, temp)
        .input('status', sql.NVarChar, status)
        .input('exercise', sql.Int, exercise)
        .input('sleep', sql.Float, sleep)
        .input('water', sql.Int, water)
        .input('mood', sql.NVarChar, mood)
        .input('note', sql.NVarChar, note)
        .query(`UPDATE health_records SET timestamp=@timestamp, temp=@temp, status=@status,
                exercise=@exercise, sleep=@sleep, water=@water, mood=@mood, note=@note
                WHERE date=@date`);
    } else {
      await pool.request()
        .input('date', sql.NVarChar, date)
        .input('timestamp', sql.BigInt, timestamp)
        .input('temp', sql.Float, temp)
        .input('status', sql.NVarChar, status)
        .input('exercise', sql.Int, exercise)
        .input('sleep', sql.Float, sleep)
        .input('water', sql.Int, water)
        .input('mood', sql.NVarChar, mood)
        .input('note', sql.NVarChar, note)
        .query(`INSERT INTO health_records (date, timestamp, temp, status, exercise, sleep, water, mood, note)
                VALUES (@date, @timestamp, @temp, @status, @exercise, @sleep, @water, @mood, @note)`);
    }
    res.json({ code: 0, msg: 'ok' });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

// 删除记录
router.delete('/records/:date', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('date', sql.NVarChar, req.params.date)
      .query('DELETE FROM health_records WHERE date = @date');
    res.json({ code: 0, msg: 'ok' });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

// 获取某月的打卡数据
router.get('/month/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const prefix = `${year}-${month.padStart(2, '0')}`;
    const pool = await getPool();
    const result = await pool.request()
      .input('prefix', sql.NVarChar, prefix + '%')
      .query('SELECT date, status FROM health_records WHERE date LIKE @prefix ORDER BY date ASC');
    res.json({ code: 0, data: result.recordset });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

module.exports = router;
