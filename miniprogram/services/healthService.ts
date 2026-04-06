import { HealthRecord } from '../models/health';
import * as healthApi from '../api/healthApi';

/** 格式化日期对象为 YYYY-MM-DD */
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 获取今天的日期字符串 */
export function getTodayStr(): string {
  return formatDate(new Date());
}

/** 获取全部记录 */
export async function getRecords(): Promise<HealthRecord[]> {
  return healthApi.fetchRecords();
}

/** 获取今日记录 */
export async function getTodayRecord(): Promise<HealthRecord | null> {
  return healthApi.fetchRecordByDate(getTodayStr());
}

/** 新增或更新记录 */
export async function upsertRecord(record: HealthRecord): Promise<void> {
  return healthApi.saveRecord(record);
}

/** 删除记录 */
export async function deleteRecord(date: string): Promise<void> {
  return healthApi.removeRecord(date);
}

/** 计算连续打卡天数 */
export function calcStreak(records: HealthRecord[]): number {
  if (records.length === 0) return 0;
  const dateSet = new Set(records.map(r => r.date));
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = formatDate(d);
    if (dateSet.has(key)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** 计算本周打卡天数（周一到周日） */
export function calcWeekCheckins(records: HealthRecord[]): { checked: boolean; date: string }[] {
  const dateSet = new Set(records.map(r => r.date));
  const result: { checked: boolean; date: string }[] = [];
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (day - i));
    const key = formatDate(d);
    const isPast = d <= now;
    result.push({ checked: isPast && dateSet.has(key), date: key });
  }
  return result;
}

/** 计算健康评分（0-100） */
export function calcHealthScore(record: HealthRecord): number {
  let score = 100;
  if (record.temp > 37.3) score -= 30;
  else if (record.temp < 36.0) score -= 10;
  if (record.exercise >= 30) score += 0;
  else if (record.exercise >= 15) score -= 5;
  else score -= 15;
  if (record.sleep >= 7 && record.sleep <= 9) score += 0;
  else if (record.sleep >= 6) score -= 5;
  else score -= 15;
  if (record.water >= 8) score += 0;
  else if (record.water >= 6) score -= 5;
  else score -= 10;
  return Math.min(100, Math.max(0, score));
}

/** 获取近N天的记录（按日期升序） */
export function getRecentRecords(records: HealthRecord[], n: number): HealthRecord[] {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.slice(-n);
}

/** 获取某月所有天的打卡状态 */
export async function getMonthData(year: number, month: number): Promise<{ day: number; status: string }[]> {
  const monthRecords = await healthApi.fetchMonthStatus(year, month);
  const map: Record<number, string> = {};
  monthRecords.forEach(r => {
    const day = parseInt(r.date.split('-')[2]);
    map[day] = r.status;
  });
  const daysInMonth = new Date(year, month, 0).getDate();
  const result = [];
  for (let d = 1; d <= daysInMonth; d++) {
    result.push({ day: d, status: map[d] || '' });
  }
  return result;
}
