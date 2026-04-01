// 食物数据：每 100g 的营养数据
// calories(kcal), protein(g), carbs(g), fat(g)
export interface FoodItem {
  id: number;
  name: string;
  category: string;
  unit: string;       // 常见单位描述
  unitWeight: number; // 常见单位对应克数
  per100: { calories: number; protein: number; carbs: number; fat: number };
}

export const FOOD_CATEGORIES = ['全部', '主食', '肉蛋', '蔬菜', '水果', '奶制品', '豆制品', '坚果', '饮品', '零食'];

export const FOOD_DB: FoodItem[] = [
  // 主食
  { id: 1,  name: '白米饭', category: '主食', unit: '碗(200g)', unitWeight: 200, per100: { calories: 116, protein: 2.6, carbs: 25.6, fat: 0.3 } },
  { id: 2,  name: '馒头', category: '主食', unit: '个(100g)', unitWeight: 100, per100: { calories: 223, protein: 7.0, carbs: 47.0, fat: 1.1 } },
  { id: 3,  name: '全麦面包', category: '主食', unit: '片(35g)', unitWeight: 35, per100: { calories: 246, protein: 8.8, carbs: 47.0, fat: 3.3 } },
  { id: 4,  name: '白面包', category: '主食', unit: '片(35g)', unitWeight: 35, per100: { calories: 265, protein: 7.9, carbs: 52.7, fat: 2.7 } },
  { id: 5,  name: '燕麦片', category: '主食', unit: '份(50g)', unitWeight: 50, per100: { calories: 367, protein: 13.0, carbs: 67.0, fat: 6.9 } },
  { id: 6,  name: '红薯', category: '主食', unit: '个(150g)', unitWeight: 150, per100: { calories: 86, protein: 1.6, carbs: 20.1, fat: 0.2 } },
  { id: 7,  name: '土豆', category: '主食', unit: '个(150g)', unitWeight: 150, per100: { calories: 77, protein: 2.0, carbs: 17.0, fat: 0.1 } },
  { id: 8,  name: '玉米', category: '主食', unit: '根(200g)', unitWeight: 200, per100: { calories: 112, protein: 4.0, carbs: 22.8, fat: 1.2 } },
  { id: 9,  name: '面条(煮熟)', category: '主食', unit: '碗(200g)', unitWeight: 200, per100: { calories: 138, protein: 4.8, carbs: 27.5, fat: 0.6 } },

  // 肉蛋
  { id: 10, name: '鸡胸肉', category: '肉蛋', unit: '份(100g)', unitWeight: 100, per100: { calories: 133, protein: 25.0, carbs: 0.0, fat: 3.1 } },
  { id: 11, name: '鸡蛋', category: '肉蛋', unit: '个(60g)', unitWeight: 60, per100: { calories: 144, protein: 13.3, carbs: 1.1, fat: 9.0 } },
  { id: 12, name: '猪里脊', category: '肉蛋', unit: '份(100g)', unitWeight: 100, per100: { calories: 143, protein: 21.0, carbs: 0.0, fat: 6.2 } },
  { id: 13, name: '牛肉(瘦)', category: '肉蛋', unit: '份(100g)', unitWeight: 100, per100: { calories: 106, protein: 20.2, carbs: 0.0, fat: 2.3 } },
  { id: 14, name: '三文鱼', category: '肉蛋', unit: '份(100g)', unitWeight: 100, per100: { calories: 208, protein: 20.4, carbs: 0.0, fat: 13.4 } },
  { id: 15, name: '虾仁', category: '肉蛋', unit: '份(100g)', unitWeight: 100, per100: { calories: 93, protein: 18.6, carbs: 1.7, fat: 0.8 } },
  { id: 16, name: '鸭腿', category: '肉蛋', unit: '个(200g)', unitWeight: 200, per100: { calories: 240, protein: 15.0, carbs: 0.0, fat: 19.7 } },
  { id: 17, name: '水煮蛋白', category: '肉蛋', unit: '个(30g)', unitWeight: 30, per100: { calories: 52, protein: 10.9, carbs: 0.7, fat: 0.2 } },

  // 蔬菜
  { id: 18, name: '西兰花', category: '蔬菜', unit: '份(100g)', unitWeight: 100, per100: { calories: 34, protein: 2.8, carbs: 5.2, fat: 0.4 } },
  { id: 19, name: '菠菜', category: '蔬菜', unit: '份(100g)', unitWeight: 100, per100: { calories: 24, protein: 2.9, carbs: 2.9, fat: 0.4 } },
  { id: 20, name: '黄瓜', category: '蔬菜', unit: '根(200g)', unitWeight: 200, per100: { calories: 16, protein: 0.8, carbs: 2.9, fat: 0.1 } },
  { id: 21, name: '西红柿', category: '蔬菜', unit: '个(150g)', unitWeight: 150, per100: { calories: 18, protein: 0.9, carbs: 3.5, fat: 0.2 } },
  { id: 22, name: '生菜', category: '蔬菜', unit: '份(100g)', unitWeight: 100, per100: { calories: 13, protein: 1.3, carbs: 2.0, fat: 0.2 } },
  { id: 23, name: '胡萝卜', category: '蔬菜', unit: '根(100g)', unitWeight: 100, per100: { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 } },
  { id: 24, name: '香菇', category: '蔬菜', unit: '份(50g)', unitWeight: 50, per100: { calories: 26, protein: 2.2, carbs: 4.3, fat: 0.3 } },
  { id: 25, name: '苦瓜', category: '蔬菜', unit: '份(100g)', unitWeight: 100, per100: { calories: 22, protein: 1.0, carbs: 4.9, fat: 0.1 } },

  // 水果
  { id: 26, name: '苹果', category: '水果', unit: '个(200g)', unitWeight: 200, per100: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 } },
  { id: 27, name: '香蕉', category: '水果', unit: '根(120g)', unitWeight: 120, per100: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 } },
  { id: 28, name: '橙子', category: '水果', unit: '个(200g)', unitWeight: 200, per100: { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1 } },
  { id: 29, name: '草莓', category: '水果', unit: '份(100g)', unitWeight: 100, per100: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 } },
  { id: 30, name: '西瓜', category: '水果', unit: '片(300g)', unitWeight: 300, per100: { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.1 } },
  { id: 31, name: '葡萄', category: '水果', unit: '份(100g)', unitWeight: 100, per100: { calories: 69, protein: 0.6, carbs: 18.1, fat: 0.2 } },
  { id: 32, name: '蓝莓', category: '水果', unit: '份(100g)', unitWeight: 100, per100: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 } },
  { id: 33, name: '猕猴桃', category: '水果', unit: '个(100g)', unitWeight: 100, per100: { calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5 } },

  // 奶制品
  { id: 34, name: '全脂牛奶', category: '奶制品', unit: '杯(250ml)', unitWeight: 258, per100: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 } },
  { id: 35, name: '脱脂牛奶', category: '奶制品', unit: '杯(250ml)', unitWeight: 258, per100: { calories: 34, protein: 3.4, carbs: 5.0, fat: 0.1 } },
  { id: 36, name: '希腊酸奶', category: '奶制品', unit: '份(150g)', unitWeight: 150, per100: { calories: 97, protein: 10.0, carbs: 3.6, fat: 5.0 } },
  { id: 37, name: '奶酪', category: '奶制品', unit: '片(20g)', unitWeight: 20, per100: { calories: 402, protein: 25.0, carbs: 1.3, fat: 33.0 } },
  { id: 38, name: '无糖酸奶', category: '奶制品', unit: '份(150g)', unitWeight: 150, per100: { calories: 59, protein: 3.5, carbs: 7.0, fat: 1.6 } },

  // 豆制品
  { id: 39, name: '豆腐', category: '豆制品', unit: '块(150g)', unitWeight: 150, per100: { calories: 76, protein: 8.1, carbs: 1.9, fat: 4.8 } },
  { id: 40, name: '豆浆(无糖)', category: '豆制品', unit: '杯(250ml)', unitWeight: 255, per100: { calories: 33, protein: 2.7, carbs: 3.0, fat: 1.6 } },
  { id: 41, name: '黄豆', category: '豆制品', unit: '份(50g)', unitWeight: 50, per100: { calories: 446, protein: 35.0, carbs: 34.2, fat: 16.0 } },
  { id: 42, name: '腐竹', category: '豆制品', unit: '份(50g)', unitWeight: 50, per100: { calories: 461, protein: 44.6, carbs: 22.3, fat: 21.7 } },
  { id: 43, name: '毛豆', category: '豆制品', unit: '份(100g)', unitWeight: 100, per100: { calories: 131, protein: 13.1, carbs: 10.5, fat: 5.0 } },

  // 坚果
  { id: 44, name: '核桃', category: '坚果', unit: '个(15g)', unitWeight: 15, per100: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2 } },
  { id: 45, name: '杏仁', category: '坚果', unit: '份(30g)', unitWeight: 30, per100: { calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9 } },
  { id: 46, name: '花生', category: '坚果', unit: '份(30g)', unitWeight: 30, per100: { calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2 } },
  { id: 47, name: '腰果', category: '坚果', unit: '份(30g)', unitWeight: 30, per100: { calories: 553, protein: 18.2, carbs: 30.2, fat: 43.9 } },

  // 饮品
  { id: 48, name: '美式咖啡', category: '饮品', unit: '杯(300ml)', unitWeight: 300, per100: { calories: 2, protein: 0.3, carbs: 0.0, fat: 0.0 } },
  { id: 49, name: '拿铁(全脂)', category: '饮品', unit: '杯(300ml)', unitWeight: 300, per100: { calories: 61, protein: 3.5, carbs: 5.1, fat: 2.9 } },
  { id: 50, name: '绿茶(无糖)', category: '饮品', unit: '杯(300ml)', unitWeight: 300, per100: { calories: 1, protein: 0.2, carbs: 0.0, fat: 0.0 } },
  { id: 51, name: '橙汁', category: '饮品', unit: '杯(250ml)', unitWeight: 250, per100: { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 } },
  { id: 52, name: '全脂奶茶', category: '饮品', unit: '杯(500ml)', unitWeight: 500, per100: { calories: 56, protein: 1.2, carbs: 8.5, fat: 1.8 } },

  // 零食
  { id: 53, name: '薯片', category: '零食', unit: '包(40g)', unitWeight: 40, per100: { calories: 536, protein: 6.6, carbs: 55.0, fat: 32.4 } },
  { id: 54, name: '巧克力(黑)', category: '零食', unit: '块(30g)', unitWeight: 30, per100: { calories: 599, protein: 4.9, carbs: 59.4, fat: 42.6 } },
  { id: 55, name: '饼干(苏打)', category: '零食', unit: '片(10g)', unitWeight: 10, per100: { calories: 408, protein: 9.6, carbs: 68.6, fat: 11.9 } },
  { id: 56, name: '冰淇淋(香草)', category: '零食', unit: '球(100g)', unitWeight: 100, per100: { calories: 207, protein: 3.5, carbs: 23.6, fat: 11.0 } },
  { id: 57, name: '蛋糕(戚风)', category: '零食', unit: '块(80g)', unitWeight: 80, per100: { calories: 344, protein: 7.4, carbs: 52.3, fat: 12.2 } },
];

// 今日饮食记录的存储
const CALORIE_KEY = 'calorieRecords';

export interface DietEntry {
  id: number;
  date: string;
  foodId: number;
  foodName: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: string; // 早餐/午餐/晚餐/加餐
}

export function getDietRecords(date: string): DietEntry[] {
  const all: DietEntry[] = wx.getStorageSync(CALORIE_KEY) || [];
  return all.filter(r => r.date === date);
}

export function addDietEntry(entry: DietEntry): void {
  const all: DietEntry[] = wx.getStorageSync(CALORIE_KEY) || [];
  all.push(entry);
  wx.setStorageSync(CALORIE_KEY, all);
}

export function deleteDietEntry(id: number): void {
  const all: DietEntry[] = wx.getStorageSync(CALORIE_KEY) || [];
  wx.setStorageSync(CALORIE_KEY, all.filter(r => r.id !== id));
}

export function calcNutrition(food: FoodItem, grams: number) {
  const ratio = grams / 100;
  return {
    calories: Math.round(food.per100.calories * ratio),
    protein: Math.round(food.per100.protein * ratio * 10) / 10,
    carbs: Math.round(food.per100.carbs * ratio * 10) / 10,
    fat: Math.round(food.per100.fat * ratio * 10) / 10,
  };
}
