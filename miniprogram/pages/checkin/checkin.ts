import { HealthRecord } from '../../models/health';
import * as healthService from '../../services/healthService';

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
    wx.nextTick(() => {
      const tabBar = this.getTabBar() as any;
      if (tabBar && tabBar.data.selected !== 1) tabBar.setData({ selected: 1 });
    });
    this._loadToday();
  },

  async _loadToday() {
    try {
      const today = healthService.getTodayStr();
      const existing = await healthService.getTodayRecord();
      if (existing) {
        this.setData({
          todayStr: today,
          isEdit: true,
          temp: existing.temp,
          status: existing.status,
          exercise: existing.exercise != null ? existing.exercise : 0,
          sleep: existing.sleep != null ? existing.sleep : 7,
          water: existing.water != null ? existing.water : 8,
          mood: existing.mood != null ? existing.mood : '😊',
          note: existing.note != null ? existing.note : '',
        });
      } else {
        this.setData({ todayStr: today, isEdit: false });
      }
    } catch (err) {
      console.error('打卡页数据加载失败', err);
    }
  },

  tempChange(e: any) { this.setData({ temp: e.detail.value }); },
  exerciseChange(e: any) { this.setData({ exercise: e.detail.value }); },
  sleepChange(e: any) { this.setData({ sleep: e.detail.value }); },
  noteChange(e: any) { this.setData({ note: e.detail.value }); },

  selectStatus(e: any) { this.setData({ status: e.currentTarget.dataset.val }); },
  selectMood(e: any) { this.setData({ mood: e.currentTarget.dataset.val }); },
  setWater(e: any) { this.setData({ water: e.currentTarget.dataset.val }); },

  async submitData() {
    const { temp, status, exercise, sleep, water, mood, note } = this.data;
    const now = new Date();
    const record: HealthRecord = {
      date: healthService.getTodayStr(),
      timestamp: now.getTime(),
      temp,
      status,
      exercise,
      sleep,
      water,
      mood,
      note,
    };

    try {
      await healthService.upsertRecord(record);
      wx.showToast({
        title: this.data.isEdit ? '已更新' : '打卡成功',
        icon: 'success',
        duration: 1500,
      });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'error' });
    }
  },
});
