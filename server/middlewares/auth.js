const { verifyToken } = require('../utils/token');

function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ code: -1, msg: '未登录或登录已失效' });
    }

    const token = auth.slice(7);
    try {
        req.user = verifyToken(token);
        next();
    } catch (_err) {
        return res.status(401).json({ code: -1, msg: '登录态无效，请重新登录' });
    }
}

module.exports = { authMiddleware };
