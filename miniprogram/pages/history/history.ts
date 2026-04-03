import { HealthRecord } from '../../models/health';
import * as healthService from '../../services/healthService';

const WEEK_HEADERS = ['日', '一', '二', '三', '四', '五', '六'];

Page({
  data: {
    weekHeaders: WEEK_HEADERS,
    year: 0,
    month: 0,
    emptyDays: [] as number[],
    calDays: [] as any[],
    selectedDay: 0,
    displayRecords: [] as HealthRecord[],
  },

  onShow() {
    wx.nextTick(() => {
      const tabBar = this.getTabBar() as any;
      if (tabBar && tabBar.data.selected !== 3) tabBar.setData({ selected: 3 });
    });
    const now = new Date();
    this.setData({ year: now.getFullYear(), month: now.getMonth() + 1 }, () => {
      this.renderCalendar();
    });
  },

  prevMonth() {
    let { year, month } = this.data;
    month--;
    if (month < 1) { month = 12; year--; }
    this.setData({ year, month, selectedDay: 0 }, () => this.renderCalendar());
  },

  nextMonth() {
    let { year, month } = this.data;
    month++;
    if (month > 12) { month = 1; year++; }
    this.setData({ year, month, selectedDay: 0 }, () => this.renderCalendar());
  },

  async renderCalendar() {
    try {
      const { year, month } = this.data;
      const today = new Date();
      const todayStr = healthService.formatDate(today);

      const firstDay = new Date(year, month - 1, 1).getDay();
      const monthData = await healthService.getMonthData(year, month);

      const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
      const calDays = monthData.map(d => {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${d.day.toString().padStart(2, '0')}`;
        return {
          day: d.day,
          status: d.status,
          hasRecord: !!d.status,
          today: dateStr === todayStr,
        };
      });

      this.setData({ emptyDays, calDays });
      await this._updateList();
    } catch (err) {
      console.error('日历数据加载失败', err);
    }
  },

  selectDay(e: any) {
    const day = e.currentTarget.dataset.day;
    const newDay = this.data.selectedDay === day ? 0 : day;
    this.setData({ selectedDay: newDay }, () => this._updateList());
  },

  async _updateList() {
    try {
      const { year, month, selectedDay } = this.data;
      const prefix = `${year}-${month.toString().padStart(2, '0')}`;
      const allRecords = await healthService.getRecords();
      let records = allRecords
        .filter(r => r.date.startsWith(prefix))
        .reverse();

      if (selectedDay) {
        const dayStr = selectedDay.toString().padStart(2, '0');
        records = records.filter(r => r.date === `${prefix}-${dayStr}`);
      }
      this.setData({ displayRecords: records });
    } catch (err) {
      console.error('记录列表加载失败', err);
    }
  },

  deleteRecord(e: any) {
    const date = e.currentTarget.dataset.date;
    wx.showModal({
      title: '确认删除',
      content: `删除 ${date} 的打卡记录？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await healthService.deleteRecord(date);
            await this.renderCalendar();
            wx.showToast({ title: '已删除', icon: 'success' });
          } catch (err) {
            wx.showToast({ title: '删除失败', icon: 'error' });
          }
        }
      }
    });
  },
});
