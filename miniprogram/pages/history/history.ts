import { getRecords, deleteRecord, getMonthData, HealthRecord } from '../../utils/storage';

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

  renderCalendar() {
    const { year, month } = this.data;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`;

    // 该月第一天是星期几（0=日）
    const firstDay = new Date(year, month - 1, 1).getDay();
    const monthData = getMonthData(year, month);

    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
    const calDays = monthData.map(d => {
      const dateStr = `${year}-${month.toString().padStart(2,'0')}-${d.day.toString().padStart(2,'0')}`;
      return {
        day: d.day,
        status: d.status,
        hasRecord: !!d.status,
        today: dateStr === todayStr,
      };
    });

    this.setData({ emptyDays, calDays });
    this.updateList();
  },

  selectDay(e: any) {
    const day = e.currentTarget.dataset.day;
    const calDay = this.data.calDays.find((d: any) => d.day === day);
    if (!calDay || !calDay.hasRecord) {
      // 未打卡日：也允许点击（显示空）
    }
    const newDay = this.data.selectedDay === day ? 0 : day;
    this.setData({ selectedDay: newDay }, () => this.updateList());
  },

  updateList() {
    const { year, month, selectedDay } = this.data;
    const prefix = `${year}-${month.toString().padStart(2, '0')}`;
    let records = getRecords()
      .filter(r => r.date.startsWith(prefix))
      .reverse();

    if (selectedDay) {
      const dayStr = selectedDay.toString().padStart(2, '0');
      records = records.filter(r => r.date === `${prefix}-${dayStr}`);
    }
    this.setData({ displayRecords: records });
  },

  deleteRecord(e: any) {
    const date = e.currentTarget.dataset.date;
    wx.showModal({
      title: '确认删除',
      content: `删除 ${date} 的打卡记录？`,
      success: (res) => {
        if (res.confirm) {
          deleteRecord(date);
          this.renderCalendar();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },
});
