import { getRecords, getTodayStr, getTodayRecord, calcStreak, calcWeekCheckins, getRecentRecords } from '../../utils/storage';

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

  onShow() {
    this.loadData();
  },

  goCheckin() {
    wx.switchTab({ url: '/pages/checkin/checkin' });
  },

  loadData() {
    const records = getRecords();
    const today = getTodayStr();
    const now = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    // 今日状态
    const todayRecord = getTodayRecord();
    let todayBrief = '';
    if (todayRecord) {
      todayBrief = `体温 ${todayRecord.temp}°C · ${todayRecord.status} · 运动 ${todayRecord.exercise}分钟`;
    }

    // 统计
    const totalDays = records.length;
    const safeDays = records.filter(r => r.status === '健康').length;
    const warningDays = totalDays - safeDays;

    // 连续打卡
    const streak = calcStreak();

    // 本周
    const weekRaw = calcWeekCheckins();
    let weekChecked = 0;
    const weekData = weekRaw.map((item, i) => {
      const d = new Date(item.date);
      const isPast = d <= now;
      if (item.checked) weekChecked++;
      return {
        label: WEEK_LABELS[i],
        checked: item.checked,
        isPast,
        date: item.date,
      };
    });
    const weekPercent = Math.round((weekChecked / 7) * 100);

    // 近7天体温图
    const recent = getRecentRecords(7);
    const chartData = recent.map(item => {
      const shortDate = item.date.substring(5);
      let percent = ((item.temp - 35) / 7) * 100;
      percent = Math.min(Math.max(percent, 5), 100);
      return { temp: item.temp, shortDate, heightPercent: percent + '%' };
    });

    // 健康提示（按日期轮换）
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const healthTip = TIPS[dayOfYear % TIPS.length];

    this.setData({
      todayStr: today,
      weekDay: '周' + weekDays[now.getDay()],
      streak,
      checkedToday: !!todayRecord,
      todayBrief,
      totalDays,
      safeDays,
      warningDays,
      weekData,
      weekChecked,
      weekPercent,
      chartData,
      healthTip,
    });
  },
});
