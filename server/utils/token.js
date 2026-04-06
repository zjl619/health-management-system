const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET || 'health-app-dev-secret';

function base64Url(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function fromBase64Url(input) {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '==='.slice((normalized.length + 3) % 4);
    return Buffer.from(padded, 'base64').toString('utf8');
}

function sign(text) {
    return crypto
        .createHmac('sha256', SECRET)
        .update(text)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function createToken(payload, expiresInSeconds = 7 * 24 * 60 * 60) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const body = { ...payload, exp };

    const encodedHeader = base64Url(JSON.stringify(header));
    const encodedBody = base64Url(JSON.stringify(body));
    const signature = sign(`${encodedHeader}.${encodedBody}`);
    return `${encodedHeader}.${encodedBody}.${signature}`;
}

function verifyToken(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('无效令牌');
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('令牌格式错误');
    }

    const [encodedHeader, encodedBody, signature] = parts;
    const expected = sign(`${encodedHeader}.${encodedBody}`);
    if (signature !== expected) {
        throw new Error('令牌校验失败');
    }

    const payload = JSON.parse(fromBase64Url(encodedBody));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('令牌已过期');
    }
    return payload;
}

module.exports = { createToken, verifyToken };
