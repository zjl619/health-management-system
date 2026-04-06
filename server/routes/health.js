const express = require('express');
const router = express.Router();
const { all, get, run } = require('../config/db');

// 日期格式校验
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function isValidDate(str) {
  if (!DATE_RE.test(str)) return false;
  const d = new Date(str + 'T00:00:00');
  return !isNaN(d.getTime());
}

// 统一错误响应（脱敏）
function errRes(res, err) {
  console.error('[health]', err.message);
  res.status(500).json({ code: -1, msg: '服务器内部错误' });
}

// 获取所有健康记录
router.get('/records', async (req, res) => {
  try {
    const records = await all('SELECT * FROM health_records ORDER BY date ASC');
    res.json({ code: 0, data: records });
  } catch (err) {
    errRes(res, err);
  }
});

// 获取指定日期的记录
router.get('/records/:date', async (req, res) => {
  try {
    if (!isValidDate(req.params.date)) {
      return res.status(400).json({ code: -1, msg: '日期格式错误，应为 YYYY-MM-DD' });
    }
    const record = await get('SELECT * FROM health_records WHERE date = ?', [req.params.date]);
    res.json({ code: 0, data: record || null });
  } catch (err) {
    errRes(res, err);
  }
});

// 新增或更新记录（MERGE 原子操作，消除竞态）
router.post('/records', async (req, res) => {
  try {
    const { date, timestamp, temp, status, exercise, sleep, water, mood, note } = req.body;

    // 输入验证
    if (!date || !isValidDate(date)) {
      return res.status(400).json({ code: -1, msg: '日期格式错误' });
    }
    if (typeof temp !== 'number' || temp < 34 || temp > 43) {
      return res.status(400).json({ code: -1, msg: '体温范围应为 34~43°C' });
    }
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ code: -1, msg: '健康状态不能为空' });
    }
    const safeExercise = Math.max(0, Math.min(parseInt(exercise) || 0, 1440));
    const safeSleep = Math.max(0, Math.min(parseFloat(sleep) || 0, 24));
    const safeWater = Math.max(0, Math.min(parseInt(water) || 0, 50));
    const safeMood = (mood || '').substring(0, 10);
    const safeNote = (note || '').substring(0, 500);

    await run(`
      INSERT INTO health_records (date, timestamp, temp, status, exercise, sleep, water, mood, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        timestamp = excluded.timestamp,
        temp = excluded.temp,
        status = excluded.status,
        exercise = excluded.exercise,
        sleep = excluded.sleep,
        water = excluded.water,
        mood = excluded.mood,
        note = excluded.note
    `, [
      date,
      timestamp || Date.now(),
      temp,
      status.substring(0, 20),
      safeExercise,
      safeSleep,
      safeWater,
      safeMood,
      safeNote,
    ]);
    res.json({ code: 0, msg: 'ok' });
  } catch (err) {
    errRes(res, err);
  }
});

// 删除记录
router.delete('/records/:date', async (req, res) => {
  try {
    if (!isValidDate(req.params.date)) {
      return res.status(400).json({ code: -1, msg: '日期格式错误' });
    }
    const result = await run('DELETE FROM health_records WHERE date = ?', [req.params.date]);
    if (result.changes === 0) {
      return res.status(404).json({ code: -1, msg: '记录不存在' });
    }
    res.json({ code: 0, msg: 'ok' });
  } catch (err) {
    errRes(res, err);
  }
});

// 获取某月的打卡数据
router.get('/month/:year/:month', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ code: -1, msg: '年月参数错误' });
    }
    const prefix = `${year}-${month.toString().padStart(2, '0')}`;
    const records = await all('SELECT date, status FROM health_records WHERE date LIKE ? ORDER BY date ASC', [`${prefix}%`]);
    res.json({ code: 0, data: records });
  } catch (err) {
    errRes(res, err);
  }
});

module.exports = router;
