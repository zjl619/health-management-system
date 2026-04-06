import * as statsService from '../../services/statsService';

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
    this._loadStats();
    wx.nextTick(() => {
      const tabBar = this.getTabBar() as any;
      if (tabBar && tabBar.data.selected !== 4) tabBar.setData({ selected: 4 });
    });
  },

  async _loadStats() {
    try {
      const [summary, trends, moodStats] = await Promise.all([
        statsService.getSummary(),
        statsService.getTrends(),
        statsService.getMoodDistribution(),
      ]);

      this.setData({
        healthScore: summary.healthScore,
        scoreTitle: summary.scoreTitle,
        streak: summary.streak,
        totalDays: summary.totalDays,
        nextBadgeDiff: summary.nextBadgeDiff,
        tempChart: trends.tempChart,
        weeklyStats: trends.weeklyStats,
        avgExercise: summary.avgExercise,
        avgSleep: summary.avgSleep,
        avgWater: summary.avgWater,
        exercisePercent: summary.exercisePercent,
        sleepPercent: summary.sleepPercent,
        waterPercent: summary.waterPercent,
        moodStats,
        advices: summary.advices,
      });
    } catch (err) {
      console.error('统计数据加载失败', err);
    }
  },
});
