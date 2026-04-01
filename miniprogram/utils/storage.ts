// 健康记录数据结构
export interface HealthRecord {
  date: string;        // YYYY-MM-DD
  timestamp: number;
  temp: number;        // 体温
  status: string;      // 健康 | 发热/感冒 | 其他
  exercise: number;    // 运动时长（分钟）
  sleep: number;       // 睡眠时长（小时）
  water: number;       // 饮水量（杯）
  mood: string;        // 心情 emoji
  note: string;        // 备注
}

const STORAGE_KEY = 'healthRecords';

export function getRecords(): HealthRecord[] {
  return wx.getStorageSync(STORAGE_KEY) || [];
}

export function saveRecords(records: HealthRecord[]): void {
  wx.setStorageSync(STORAGE_KEY, records);
}

export function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayRecord(): HealthRecord | null {
  const today = getTodayStr();
  const records = getRecords();
  return records.find(r => r.date === today) || null;
}

export function upsertRecord(record: HealthRecord): void {
  const records = getRecords();
  const idx = records.findIndex(r => r.date === record.date);
  if (idx !== -1) {
    records[idx] = record;
  } else {
    records.push(record);
  }
  // 按日期升序排列
  records.sort((a, b) => a.date.localeCompare(b.date));
  saveRecords(records);
}

export function deleteRecord(date: string): void {
  const records = getRecords().filter(r => r.date !== date);
  saveRecords(records);
}

// 计算连续打卡天数
export function calcStreak(): number {
  const records = getRecords();
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

// 计算本周打卡天数（周一到今天）
export function calcWeekCheckins(): { checked: boolean; date: string }[] {
  const dateSet = new Set(getRecords().map(r => r.date));
  const result: { checked: boolean; date: string }[] = [];
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay(); // 1=周一 ... 7=周日
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (day - i));
    const key = formatDate(d);
    const isPast = d <= now;
    result.push({ checked: isPast && dateSet.has(key), date: key });
  }
  return result;
}

// 计算健康评分（0-100）
export function calcHealthScore(record: HealthRecord): number {
  let score = 100;
  // 体温扣分
  if (record.temp > 37.3) score -= 30;
  else if (record.temp < 36.0) score -= 10;
  // 运动
  if (record.exercise >= 30) score += 0;
  else if (record.exercise >= 15) score -= 5;
  else score -= 15;
  // 睡眠
  if (record.sleep >= 7 && record.sleep <= 9) score += 0;
  else if (record.sleep >= 6) score -= 5;
  else score -= 15;
  // 饮水
  if (record.water >= 8) score += 0;
  else if (record.water >= 6) score -= 5;
  else score -= 10;
  return Math.min(100, Math.max(0, score));
}

// 获取近N天的记录（按日期升序）
export function getRecentRecords(n: number): HealthRecord[] {
  const records = getRecords();
  return records.slice(-n);
}

// 格式化日期对象为 YYYY-MM-DD
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 获取某月所有天的打卡状态
export function getMonthData(year: number, month: number): { day: number; status: string }[] {
  const records = getRecords();
  const prefix = `${year}-${month.toString().padStart(2, '0')}`;
  const map: Record<number, string> = {};
  records.forEach(r => {
    if (r.date.startsWith(prefix)) {
      const day = parseInt(r.date.split('-')[2]);
      map[day] = r.status;
    }
  });
  const daysInMonth = new Date(year, month, 0).getDate();
  const result = [];
  for (let d = 1; d <= daysInMonth; d++) {
    result.push({ day: d, status: map[d] || '' });
  }
  return result;
}
