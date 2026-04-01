import { getTodayStr, getTodayRecord, upsertRecord, HealthRecord } from '../../utils/storage';

Page({
  data: {
    todayStr: '',
    isEdit: false,
    temp: 36.5,
    status: '健康',
    exercise: 30,
    sleep: 7.5,
    water: 8,
    mood: '😊',
    note: '',
    waterCups: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    statusOptions: [
      { val: '健康', emoji: '💚' },
      { val: '发热/感冒', emoji: '🤒' },
      { val: '头痛/疲劳', emoji: '😵' },
      { val: '其他不适', emoji: '😟' },
    ],
    moodOptions: [
      { val: '😄', label: '开心' },
      { val: '😊', label: '平静' },
      { val: '😐', label: '一般' },
      { val: '😔', label: '低落' },
      { val: '😤', label: '烦躁' },
    ],
  },

  onShow() {
    const today = getTodayStr();
    const existing = getTodayRecord();
    if (existing) {
      this.setData({
        todayStr: today,
        isEdit: true,
        temp: existing.temp,
        status: existing.status,
        exercise: existing.exercise ?? 0,
        sleep: existing.sleep ?? 7,
        water: existing.water ?? 8,
        mood: existing.mood ?? '😊',
        note: existing.note ?? '',
      });
    } else {
      this.setData({ todayStr: today, isEdit: false });
    }
  },

  tempChange(e: any) { this.setData({ temp: e.detail.value }); },
  exerciseChange(e: any) { this.setData({ exercise: e.detail.value }); },
  sleepChange(e: any) { this.setData({ sleep: e.detail.value }); },
  noteChange(e: any) { this.setData({ note: e.detail.value }); },

  selectStatus(e: any) { this.setData({ status: e.currentTarget.dataset.val }); },
  selectMood(e: any) { this.setData({ mood: e.currentTarget.dataset.val }); },
  setWater(e: any) { this.setData({ water: e.currentTarget.dataset.val }); },

  submitData() {
    const { temp, status, exercise, sleep, water, mood, note } = this.data;
    const now = new Date();
    const record: HealthRecord = {
      date: getTodayStr(),
      timestamp: now.getTime(),
      temp,
      status,
      exercise,
      sleep,
      water,
      mood,
      note,
    };
    upsertRecord(record);

    wx.showToast({
      title: this.data.isEdit ? '已更新' : '打卡成功 🎉',
      icon: 'success',
      duration: 1500,
    });

    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' });
    }, 1500);
  },
});
