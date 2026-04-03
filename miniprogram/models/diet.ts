/** 食物条目（每 100g 营养数据） */
export interface FoodItem {
  id: number;
  name: string;
  category: string;
  unit: string;        // 常见单位描述
  unitWeight: number;  // 常见单位对应克数
  per100: { calories: number; protein: number; carbs: number; fat: number };
}

/** 饮食记录 */
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
