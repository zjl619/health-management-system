import { FoodItem, DietEntry } from '../models/diet';
import * as dietApi from '../api/dietApi';

/** 获取指定日期的饮食记录 */
export async function getDietRecords(date: string): Promise<DietEntry[]> {
  return dietApi.fetchDietRecords(date);
}

/** 添加饮食记录 */
export async function addDietEntry(entry: Omit<DietEntry, 'id'>): Promise<void> {
  return dietApi.addDietRecord(entry);
}

/** 删除饮食记录 */
export async function deleteDietEntry(id: number): Promise<void> {
  return dietApi.removeDietRecord(id);
}

/** 计算指定克数的营养值 */
export function calcNutrition(food: FoodItem, grams: number) {
  const ratio = grams / 100;
  return {
    calories: Math.round(food.per100.calories * ratio),
    protein: Math.round(food.per100.protein * ratio * 10) / 10,
    carbs: Math.round(food.per100.carbs * ratio * 10) / 10,
    fat: Math.round(food.per100.fat * ratio * 10) / 10,
  };
}
