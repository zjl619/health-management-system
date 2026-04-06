import { get, post, del } from './request';
import { DietEntry } from '../models/diet';

/** 获取指定日期的饮食记录 */
export function fetchDietRecords(date: string): Promise<DietEntry[]> {
  return get<DietEntry[]>('/diet/records/' + date);
}

/** 添加一条饮食记录 */
export function addDietRecord(entry: Omit<DietEntry, 'id'>): Promise<void> {
  return post('/diet/records', entry);
}

/** 删除饮食记录 */
export function removeDietRecord(id: number): Promise<void> {
  return del('/diet/records/' + id);
}
