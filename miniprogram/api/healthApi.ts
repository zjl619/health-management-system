import { get, post, del } from './request';
import { HealthRecord } from '../models/health';

/** 获取全部健康记录 */
export function fetchRecords(): Promise<HealthRecord[]> {
  return get<HealthRecord[]>('/health/records');
}

/** 获取指定日期的记录 */
export function fetchRecordByDate(date: string): Promise<HealthRecord | null> {
  return get<HealthRecord | null>('/health/records/' + date);
}

/** 新增或更新记录 */
export function saveRecord(record: HealthRecord): Promise<void> {
  return post('/health/records', record);
}

/** 删除指定日期记录 */
export function removeRecord(date: string): Promise<void> {
  return del('/health/records/' + date);
}

/** 获取某月打卡状态 */
export function fetchMonthStatus(year: number, month: number): Promise<{ date: string; status: string }[]> {
  return get('/health/month/' + year + '/' + month);
}
