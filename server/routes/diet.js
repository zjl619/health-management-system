const express = require('express');
const router = express.Router();
const { all, run } = require('../config/db');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function isValidDate(str) {
  if (!DATE_RE.test(str)) return false;
  const d = new Date(str + 'T00:00:00');
  return !isNaN(d.getTime());
}

function errRes(res, err) {
  console.error('[diet]', err.message);
  res.status(500).json({ code: -1, msg: '服务器内部错误' });
}

const VALID_MEALS = ['早餐', '午餐', '晚餐', '加餐'];

// 获取指定日期的饮食记录
router.get('/records/:date', async (req, res) => {
  try {
    if (!isValidDate(req.params.date)) {
      return res.status(400).json({ code: -1, msg: '日期格式错误' });
    }
    const records = await all('SELECT * FROM diet_entries WHERE date = ? ORDER BY id ASC', [req.params.date]);
    res.json({ code: 0, data: records });
  } catch (err) {
    errRes(res, err);
  }
});

// 添加饮食记录
router.post('/records', async (req, res) => {
  try {
    const { date, foodId, foodName, grams, calories, protein, carbs, fat, meal } = req.body;

    // 输入验证
    if (!date || !isValidDate(date)) {
      return res.status(400).json({ code: -1, msg: '日期格式错误' });
    }
    if (!foodName || typeof foodName !== 'string') {
      return res.status(400).json({ code: -1, msg: '食物名称不能为空' });
    }
    if (!meal || !VALID_MEALS.includes(meal)) {
      return res.status(400).json({ code: -1, msg: '餐次无效' });
    }
    const safeGrams = Math.max(0, Math.min(parseInt(grams) || 0, 5000));
    const safeCal = Math.max(0, Math.min(parseInt(calories) || 0, 10000));
    const safePro = Math.max(0, Math.min(parseFloat(protein) || 0, 500));
    const safeCarbs = Math.max(0, Math.min(parseFloat(carbs) || 0, 500));
    const safeFat = Math.max(0, Math.min(parseFloat(fat) || 0, 500));

    await run(
      `INSERT INTO diet_entries (date, food_id, food_name, grams, calories, protein, carbs, fat, meal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        date,
        parseInt(foodId) || 0,
        foodName.substring(0, 50),
        safeGrams,
        safeCal,
        safePro,
        safeCarbs,
        safeFat,
        meal,
      ],
    );
    res.json({ code: 0, msg: 'ok' });
  } catch (err) {
    errRes(res, err);
  }
});

// 删除饮食记录
router.delete('/records/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ code: -1, msg: '无效的记录 ID' });
    }
    const result = await run('DELETE FROM diet_entries WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ code: -1, msg: '记录不存在' });
    }
    res.json({ code: 0, msg: 'ok' });
  } catch (err) {
    errRes(res, err);
  }
});

// 获取食物库
router.get('/foods', async (req, res) => {
  try {
    const foods = await all('SELECT * FROM foods ORDER BY id ASC');
    res.json({ code: 0, data: foods });
  } catch (err) {
    errRes(res, err);
  }
});

module.exports = router;
