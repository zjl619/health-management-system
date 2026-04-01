import { getRecords, calcStreak, getRecentRecords, calcHealthScore } from '../../utils/storage';

Page({
  data: {
    healthScore: 0,
    scoreTitle: '',
    streak: 0,
    totalDays: 0,
    nextBadgeDiff: 0,
    tempChart: [] as any[],
    weeklyStats: [] as any[],
    avgExercise: 0,
    avgSleep: 0,
    avgWater: 0,
    exercisePercent: 0,
    sleepPercent: 0,
    waterPercent: 0,
    moodStats: [] as any[],
    advices: [] as string[],
  },

  onShow() {
    this.loadStats();
    wx.nextTick(() => {
      const tabBar = this.getTabBar() as any;
      if (tabBar && tabBar.data.selected !== 4) tabBar.setData({ selected: 4 });
    });
  },

  loadStats() {
    const records = getRecords();
    const streak = calcStreak();
    const totalDays = records.length;

    // 下一成就差距
    const milestones = [3, 7, 30, 100];
    const next = milestones.find(m => streak < m) || milestones[milestones.length - 1];
    const nextBadgeDiff = Math.max(0, next - streak);

    // 近7天记录
    const recent7 = getRecentRecords(7);

    // 健康评分（取近7天均值）
    let healthScore = 75;
    if (recent7.length > 0) {
      const avg = recent7.reduce((sum, r) => sum + calcHealthScore(r), 0) / recent7.length;
      healthScore = Math.round(avg);
    }
    const scoreTitle = healthScore >= 90 ? '非常健康 🌟' :
      healthScore >= 75 ? '状态良好 👍' :
      healthScore >= 60 ? '需要关注 ⚠️' : '请多注意健康 ❗';

    // 体温图
    const tempChart = recent7.map(r => {
      const shortDate = r.date.substring(5);
      const isHigh = r.temp > 37.3;
      let percent = ((r.temp - 35.5) / 3) * 100;
      percent = Math.min(Math.max(percent, 5), 100);
      return { temp: r.temp, shortDate, heightPercent: percent + '%', isHigh };
    });

    // 本周均值
    const weeklyStats = recent7;
    let avgExercise = 0, avgSleep = 0, avgWater = 0;
    if (weeklyStats.length > 0) {
      avgExercise = Math.round(weeklyStats.reduce((s, r) => s + (r.exercise || 0), 0) / weeklyStats.length);
      avgSleep = Math.round(weeklyStats.reduce((s, r) => s + (r.sleep || 0), 0) / weeklyStats.length * 10) / 10;
      avgWater = Math.round(weeklyStats.reduce((s, r) => s + (r.water || 0), 0) / weeklyStats.length * 10) / 10;
    }
    const exercisePercent = Math.min(100, (avgExercise / 60) * 100);
    const sleepPercent = Math.min(100, (avgSleep / 9) * 100);
    const waterPercent = Math.min(100, (avgWater / 10) * 100);

    // 心情分布（近30条）
    const recent30 = getRecentRecords(30);
    const moodCount: Record<string, number> = {};
    recent30.forEach(r => {
      if (r.mood) moodCount[r.mood] = (moodCount[r.mood] || 0) + 1;
    });
    const maxMood = Math.max(1, ...Object.values(moodCount));
    const moodStats = Object.entries(moodCount).map(([mood, count]) => ({
      mood,
      count,
      percent: Math.round((count / maxMood) * 100),
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    // 个性化建议
    const advices: string[] = [];
    if (avgExercise < 30) advices.push('本周运动不足，建议每天至少运动30分钟。');
    if (avgSleep < 7) advices.push('睡眠时间偏少，保持7-9小时睡眠有助于恢复体力。');
    if (avgWater < 8) advices.push('饮水量不足，建议每天喝满8杯水（约2升）。');
    if (records.some(r => r.temp > 37.3)) advices.push('近期有体温偏高记录，请注意休息，必要时就医。');
    if (streak === 0) advices.push('还没有打卡记录，坚持每天打卡可以帮助追踪健康状态。');
    else if (streak < 7) advices.push(`已连续打卡 ${streak} 天，继续保持！还需 ${7 - streak} 天解锁"一周坚持"成就。`);
    if (advices.length === 0) advices.push('各项健康指标良好，继续保持！');

    this.setData({
      healthScore,
      scoreTitle,
      streak,
      totalDays,
      nextBadgeDiff,
      tempChart,
      weeklyStats,
      avgExercise,
      avgSleep,
      avgWater,
      exercisePercent,
      sleepPercent,
      waterPercent,
      moodStats,
      advices,
    });
  },
});
