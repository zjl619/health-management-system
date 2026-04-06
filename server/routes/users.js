const express = require('express');
const router = express.Router();
const { all, run } = require('../config/db');
const { authMiddleware } = require('../middlewares/auth');

function errRes(res, err) {
    console.error('[users]', err.message);
    res.status(500).json({ code: -1, msg: '服务器内部错误' });
}

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await all(
            `SELECT id, openid, nickname, avatar, gender, created_at, updated_at
                         FROM users
                         WHERE id = ?`,
            [req.user.userId],
        ).then((rows) => rows[0]);
        if (!user) {
            return res.status(404).json({ code: -1, msg: '用户不存在' });
        }
        res.json({ code: 0, data: user });
    } catch (err) {
        errRes(res, err);
    }
});

router.put('/me', authMiddleware, async (req, res) => {
    try {
        const nickname = (req.body.nickname || '').trim();
        const avatar = (req.body.avatar || '').trim();
        const gender = (req.body.gender || '').trim();

        if (!nickname) {
            return res.status(400).json({ code: -1, msg: '昵称不能为空' });
        }

        const updateResult = await run(
            `UPDATE users
                         SET nickname = ?,
                                 avatar = ?,
                                 gender = ?,
                                 updated_at = CURRENT_TIMESTAMP
                         WHERE id = ?`,
            [nickname.substring(0, 50), avatar.substring(0, 255), gender.substring(0, 10), req.user.userId],
        );

        if (updateResult.changes === 0) {
            return res.status(404).json({ code: -1, msg: '用户不存在' });
        }

        const user = await all(
            `SELECT id, openid, nickname, avatar, gender, created_at, updated_at
                         FROM users
                         WHERE id = ?`,
            [req.user.userId],
        ).then((rows) => rows[0]);

        res.json({ code: 0, data: user });
    } catch (err) {
        errRes(res, err);
    }
});

module.exports = router;
