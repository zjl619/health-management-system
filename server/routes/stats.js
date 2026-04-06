const express = require('express');
const router = express.Router();
const { all } = require('../config/db');

function errRes(res, err) {
    console.error('[stats]', err.message);
    res.status(500).json({ code: -1, msg: '服务器内部错误' });
}

function toDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function calcStreak(records) {
    if (!records.length) return 0;
    const dateSet = new Set(records.map((r) => r.date));
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 365; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        if (dateSet.has(toDateKey(d))) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function calcHealthScore(record) {
    let score = 100;
    if (record.temp > 37.3) score -= 30;
    else if (record.temp < 36.0) score -= 10;

    if (record.exercise >= 30) score += 0;
    else if (record.exercise >= 15) score -= 5;
    else score -= 15;

    if (record.sleep >= 7 && record.sleep <= 9) score += 0;
    else if (record.sleep >= 6) score -= 5;
    else score -= 15;

    if (record.water >= 8) score += 0;
    else if (record.water >= 6) score -= 5;
    else score -= 10;

    return Math.max(0, Math.min(100, score));
}

function recentRecords(records, n) {
    const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.slice(-n);
}

async function fetchAllHealthRecords() {
    return all('SELECT * FROM health_records ORDER BY date ASC');
}

router.get('/summary', async (_req, res) => {
    try {
        const records = await fetchAllHealthRecords();
        const streak = calcStreak(records);
        const totalDays = records.length;

        const milestones = [3, 7, 30, 100];
        const next = milestones.find((m) => streak < m) || milestones[milestones.length - 1];
        const nextBadgeDiff = Math.max(0, next - streak);

        const recent7 = recentRecords(records, 7);
        let healthScore = 75;
        if (recent7.length) {
            const avg = recent7.reduce((sum, r) => sum + calcHealthScore(r), 0) / recent7.length;
            healthScore = Math.round(avg);
        }
        const scoreTitle = healthScore >= 90
            ? '非常健康'
            : healthScore >= 75
                ? '状态良好'
                : healthScore >= 60
                    ? '需要关注'
                    : '请多注意健康';

        let avgExercise = 0;
        let avgSleep = 0;
        let avgWater = 0;
        if (recent7.length) {
            avgExercise = Math.round(recent7.reduce((s, r) => s + (r.exercise || 0), 0) / recent7.length);
            avgSleep = Math.round((recent7.reduce((s, r) => s + (r.sleep || 0), 0) / recent7.length) * 10) / 10;
            avgWater = Math.round((recent7.reduce((s, r) => s + (r.water || 0), 0) / recent7.length) * 10) / 10;
        }

        const exercisePercent = Math.min(100, (avgExercise / 60) * 100);
        const sleepPercent = Math.min(100, (avgSleep / 9) * 100);
        const waterPercent = Math.min(100, (avgWater / 10) * 100);

        const advices = [];
        if (avgExercise < 30) advices.push('本周运动不足，建议每天至少运动30分钟。');
        if (avgSleep < 7) advices.push('睡眠时间偏少，保持7-9小时睡眠有助于恢复体力。');
        if (avgWater < 8) advices.push('饮水量不足，建议每天喝满8杯水（约2升）。');
        if (records.some((r) => r.temp > 37.3)) advices.push('近期有体温偏高记录，请注意休息，必要时就医。');
        if (streak === 0) advices.push('还没有打卡记录，坚持每天打卡可以帮助追踪健康状态。');
        else if (streak < 7) advices.push(`已连续打卡 ${streak} 天，继续保持！`);
        if (advices.length === 0) advices.push('各项健康指标良好，继续保持！');

        res.json({
            code: 0,
            data: {
                healthScore,
                scoreTitle,
                streak,
                totalDays,
                nextBadgeDiff,
                avgExercise,
                avgSleep,
                avgWater,
                exercisePercent,
                sleepPercent,
                waterPercent,
                advices,
            },
        });
    } catch (err) {
        errRes(res, err);
    }
});

router.get('/trends', async (_req, res) => {
    try {
        const records = await fetchAllHealthRecords();
        const recent7 = recentRecords(records, 7);

        const tempChart = recent7.map((r) => {
            const shortDate = r.date.substring(5);
            const isHigh = r.temp > 37.3;
            let percent = ((r.temp - 35.5) / 3) * 100;
            percent = Math.min(Math.max(percent, 5), 100);
            return { temp: r.temp, shortDate, heightPercent: `${percent}%`, isHigh };
        });

        res.json({
            code: 0,
            data: {
                tempChart,
                weeklyStats: recent7,
            },
        });
    } catch (err) {
        errRes(res, err);
    }
});

router.get('/mood-distribution', async (_req, res) => {
    try {
        const records = await fetchAllHealthRecords();
        const recent30 = recentRecords(records, 30);
        const moodCount = {};

        recent30.forEach((r) => {
            if (!r.mood) return;
            moodCount[r.mood] = (moodCount[r.mood] || 0) + 1;
        });

        const maxMood = Math.max(1, ...Object.values(moodCount));
        const moodStats = Object.entries(moodCount)
            .map(([mood, count]) => ({
                mood,
                count,
                percent: Math.round((count / maxMood) * 100),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        res.json({ code: 0, data: moodStats });
    } catch (err) {
        errRes(res, err);
    }
});

module.exports = router;