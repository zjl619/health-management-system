import * as healthService from '../../services/healthService';
import * as authService from '../../services/authService';

const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日'];
const TIPS = [
  '每天保持30分钟以上的有氧运动，有助于增强免疫力。',
  '成年人每天应喝8杯水（约2升），保持水分充足。',
  '规律的睡眠是健康的基础，建议每晚7-9小时。',
  '保持积极乐观的心态，有助于身心健康。',
  '饮食均衡，多吃蔬果，减少高糖高脂食品。',
  '连续久坐超过1小时，建议起身活动5分钟。',
  '体温正常范围：36.1°C ~ 37.3°C，如有异常及时就医。',
];

Page({
  data: {
    userEmoji: '🧑',
    userName: '健康达人',
    todayStr: '',
    weekDay: '',
    streak: 0,
    checkedToday: false,
    todayBrief: '',
    totalDays: 0,
    safeDays: 0,
    warningDays: 0,
    weekData: [] as any[],
    weekChecked: 0,
    weekPercent: 0,
    chartData: [] as any[],
    healthTip: '',
  },

  onLoad() {
    const now = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    this.setData({
      todayStr: healthService.getTodayStr(),
      weekDay: '周' + weekDays[now.getDay()],
      healthTip: TIPS[dayOfYear % TIPS.length],
    });
  },

  onShow() {
    this._refreshProfile();
    this._refreshData();
    wx.nextTick(() => {
      const tabBar = this.getTabBar() as any;
      if (tabBar && tabBar.data.selected !== 0) tabBar.setData({ selected: 0 });
    });
  },

  goCheckin() {
    wx.switchTab({ url: '/pages/checkin/checkin' });
  },

  goProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  async _refreshProfile() {
    try {
      const local = authService.getLocalProfile();
      if (local && local.nickname) {
        this.setData({ userName: local.nickname });
      }
      const remote = await authService.fetchProfile();
      if (remote && remote.nickname) {
        this.setData({ userName: remote.nickname });
      }
    } catch (err) {
      console.error('首页用户信息加载失败', err);
    }
  },

  async _refreshData() {
    try {
      const records = await healthService.getRecords();
      const now = new Date();
      const todayStr = healthService.getTodayStr();
      const todayRecord = records.find(r => r.date === todayStr) || null;

      let todayBrief = '';
      if (todayRecord) {
        todayBrief = `体温 ${todayRecord.temp}°C · ${todayRecord.status} · 运动 ${todayRecord.exercise}分钟`;
      }

      const totalDays = records.length;
      const safeDays = records.filter(r => r.status === '健康').length;
      const streak = healthService.calcStreak(records);

      const weekRaw = healthService.calcWeekCheckins(records);
      let weekChecked = 0;
      const weekData = weekRaw.map((item, i) => {
        const d = new Date(item.date);
        const isPast = d <= now;
        if (item.checked) weekChecked++;
        return { label: WEEK_LABELS[i], checked: item.checked, isPast };
      });
      const weekPercent = Math.round((weekChecked / 7) * 100);

      const recent = healthService.getRecentRecords(records, 7);
      const chartData = recent.map(item => {
        const shortDate = item.date.substring(5);
        let percent = ((item.temp - 35) / 7) * 100;
        percent = Math.min(Math.max(percent, 5), 100);
        return { temp: item.temp, shortDate, heightPercent: percent + '%' };
      });

      this.setData({
        streak,
        checkedToday: !!todayRecord,
        todayBrief,
        totalDays,
        safeDays,
        warningDays: totalDays - safeDays,
        weekData,
        weekChecked,
        weekPercent,
        chartData,
      });
    } catch (err) {
      console.error('首页数据加载失败', err);
    }
  },
});
