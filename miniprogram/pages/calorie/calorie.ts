import { FoodItem, DietEntry } from '../../models/diet';
import { FOOD_DB, FOOD_CATEGORIES } from '../../config/food';
import * as dietService from '../../services/dietService';
import { getTodayStr } from '../../services/healthService';

const MEAL_OPTIONS = [
  { val: '早餐', icon: '🌅' },
  { val: '午餐', icon: '🌤️' },
  { val: '晚餐', icon: '🌙' },
  { val: '加餐', icon: '🍎' },
];
const TARGET_CALORIES = 2000;
const PAGE_SIZE = 20;

Page({
  _allFilteredFoods: [] as FoodItem[],

  data: {
    todayStr: '',
    todayCalories: 0,
    todayProtein: 0,
    todayCarbs: 0,
    todayFat: 0,
    targetCalories: TARGET_CALORIES,
    caloriePct: 0,
    proteinPct: 0,
    carbsPct: 0,
    fatPct: 0,
    todayEntries: [] as DietEntry[],
    mealGroups: [] as any[],
    mealOptions: MEAL_OPTIONS,
    currentMeal: '午餐',
    categories: FOOD_CATEGORIES,
    selectedCat: '全部',
    keyword: '',
    filteredFoods: [] as FoodItem[],
    hasMore: false,
    showModal: false,
    selectedFood: {} as FoodItem,
    inputGrams: 100,
    calcResult: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  },

  onLoad() {
    this.setData({ todayStr: getTodayStr() });
    this._buildFilteredList();
  },

  onShow() {
    this._loadToday();
    wx.nextTick(() => {
      const tabBar = this.getTabBar() as any;
      if (tabBar && tabBar.data.selected !== 2) tabBar.setData({ selected: 2 });
    });
  },

  async _loadToday() {
    try {
      const entries = await dietService.getDietRecords(getTodayStr());
      let cal = 0, prot = 0, carb = 0, fat = 0;
      entries.forEach(e => {
        cal += e.calories; prot += e.protein; carb += e.carbs; fat += e.fat;
      });
      cal = Math.round(cal);
      prot = Math.round(prot * 10) / 10;
      carb = Math.round(carb * 10) / 10;
      fat = Math.round(fat * 10) / 10;

      const caloriePct = Math.min(100, Math.round((cal / TARGET_CALORIES) * 100));
      const proteinPct = Math.min(100, Math.round((prot / 60) * 100));
      const carbsPct = Math.min(100, Math.round((carb / 250) * 100));
      const fatPct = Math.min(100, Math.round((fat / 65) * 100));

      const meals = ['早餐', '午餐', '晚餐', '加餐'];
      const mealIcons: Record<string, string> = { '早餐': '🌅', '午餐': '🌤️', '晚餐': '🌙', '加餐': '🍎' };
      const mealGroups = meals.map(meal => ({
        meal,
        icon: mealIcons[meal],
        entries: entries.filter(e => e.meal === meal),
        totalCal: entries.filter(e => e.meal === meal).reduce((s, e) => s + e.calories, 0),
      }));

      this.setData({
        todayCalories: cal, todayProtein: prot, todayCarbs: carb, todayFat: fat,
        caloriePct, proteinPct, carbsPct, fatPct,
        todayEntries: entries, mealGroups,
      });
    } catch (err) {
      console.error('卡路里数据加载失败', err);
    }
  },

  _buildFilteredList() {
    const { keyword, selectedCat } = this.data;
    let list = FOOD_DB as FoodItem[];
    if (keyword) {
      list = list.filter(f => f.name.includes(keyword));
    } else if (selectedCat !== '全部') {
      list = list.filter(f => f.category === selectedCat);
    }
    this._allFilteredFoods = list;
    this.setData({
      filteredFoods: list.slice(0, PAGE_SIZE),
      hasMore: list.length > PAGE_SIZE,
    });
  },

  onReachBottom() {
    const current = this.data.filteredFoods.length;
    const next = this._allFilteredFoods.slice(current, current + PAGE_SIZE);
    if (next.length === 0) return;
    this.setData({
      filteredFoods: this.data.filteredFoods.concat(next),
      hasMore: current + next.length < this._allFilteredFoods.length,
    });
  },

  onSearch(e: any) {
    this.setData({ keyword: e.detail.value }, () => this._buildFilteredList());
  },

  clearSearch() {
    this.setData({ keyword: '' }, () => this._buildFilteredList());
  },

  selectCat(e: any) {
    const cat = e.currentTarget.dataset.cat;
    if (cat === this.data.selectedCat) return;
    this.setData({ selectedCat: cat }, () => this._buildFilteredList());
  },

  selectMeal(e: any) {
    this.setData({ currentMeal: e.currentTarget.dataset.val });
  },

  openFood(e: any) {
    const id = e.currentTarget.dataset.id;
    const food = FOOD_DB.find(f => f.id === id);
    if (!food) return;
    const grams = food.unitWeight;
    this.setData({
      showModal: true,
      selectedFood: food,
      inputGrams: grams,
      calcResult: dietService.calcNutrition(food, grams),
    });
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  noop() {},

  gramChange(e: any) {
    const grams = e.detail.value;
    this.setData({ inputGrams: grams, calcResult: dietService.calcNutrition(this.data.selectedFood, grams) });
  },

  setGram(e: any) {
    const grams = e.currentTarget.dataset.g;
    this.setData({ inputGrams: grams, calcResult: dietService.calcNutrition(this.data.selectedFood, grams) });
  },

  async addToDay() {
    const { selectedFood, inputGrams, calcResult, currentMeal } = this.data;
    const entry = {
      date: getTodayStr(),
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      grams: inputGrams,
      meal: currentMeal,
      ...calcResult,
    };
    try {
      await dietService.addDietEntry(entry);
      this.setData({ showModal: false });
      await this._loadToday();
      wx.showToast({ title: '已添加', icon: 'success', duration: 1200 });
    } catch (err) {
      wx.showToast({ title: '添加失败', icon: 'error' });
    }
  },

  deleteEntry(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除记录',
      content: '确认删除这条饮食记录？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await dietService.deleteDietEntry(id);
            await this._loadToday();
            wx.showToast({ title: '已删除', icon: 'success' });
          } catch (err) {
            wx.showToast({ title: '删除失败', icon: 'error' });
          }
        }
      }
    });
  },
});
