const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// 获取指定日期的饮食记录
router.get('/records/:date', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('date', sql.NVarChar, req.params.date)
      .query('SELECT * FROM diet_entries WHERE date = @date ORDER BY id ASC');
    res.json({ code: 0, data: result.recordset });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

// 添加饮食记录
router.post('/records', async (req, res) => {
  try {
    const { date, foodId, foodName, grams, calories, protein, carbs, fat, meal } = req.body;
    const pool = await getPool();
    await pool.request()
      .input('date', sql.NVarChar, date)
      .input('foodId', sql.Int, foodId)
      .input('foodName', sql.NVarChar, foodName)
      .input('grams', sql.Int, grams)
      .input('calories', sql.Int, calories)
      .input('protein', sql.Float, protein)
      .input('carbs', sql.Float, carbs)
      .input('fat', sql.Float, fat)
      .input('meal', sql.NVarChar, meal)
      .query(`INSERT INTO diet_entries (date, food_id, food_name, grams, calories, protein, carbs, fat, meal)
              VALUES (@date, @foodId, @foodName, @grams, @calories, @protein, @carbs, @fat, @meal)`);
    res.json({ code: 0, msg: 'ok' });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

// 删除饮食记录
router.delete('/records/:id', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM diet_entries WHERE id = @id');
    res.json({ code: 0, msg: 'ok' });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

// 获取食物库
router.get('/foods', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM foods ORDER BY id ASC');
    res.json({ code: 0, data: result.recordset });
  } catch (err) {
    res.json({ code: -1, msg: err.message });
  }
});

module.exports = router;
