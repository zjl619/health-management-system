const express = require('express');
const router = express.Router();
const { all, run } = require('../config/db');
const { createToken } = require('../utils/token');

function errRes(res, err) {
    console.error('[auth]', err.message);
    res.status(500).json({ code: -1, msg: '服务器内部错误' });
}

router.post('/login', async (req, res) => {
    try {
        const openid = (req.body.openid || '').trim();
        const nickname = (req.body.nickname || '微信用户').trim();
        const avatar = (req.body.avatar || '').trim();
        const gender = (req.body.gender || '').trim();

        if (!openid) {
            return res.status(400).json({ code: -1, msg: 'openid 不能为空' });
        }

        await run(
            `INSERT INTO users (openid, nickname, avatar, gender, created_at, updated_at)
             VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             ON CONFLICT(openid) DO UPDATE SET
               nickname = excluded.nickname,
               avatar = excluded.avatar,
               gender = excluded.gender,
               updated_at = CURRENT_TIMESTAMP`,
            [openid, nickname.substring(0, 50), avatar.substring(0, 255), gender.substring(0, 10)],
        );

        const user = await all(
            `SELECT id, openid, nickname, avatar, gender, created_at, updated_at
             FROM users
             WHERE openid = ?`,
            [openid],
        ).then((rows) => rows[0]);
        const token = createToken({ userId: user.id, openid: user.openid });
        res.json({ code: 0, data: { token, user } });
    } catch (err) {
        errRes(res, err);
    }
});

module.exports = router;
