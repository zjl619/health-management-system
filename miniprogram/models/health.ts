/** 健康打卡记录 */
export interface HealthRecord {
  date: string;        // YYYY-MM-DD
  timestamp: number;
  temp: number;        // 体温
  status: string;      // 健康 | 发热/感冒 | 头痛/疲劳 | 其他不适
  exercise: number;    // 运动时长（分钟）
  sleep: number;       // 睡眠时长（小时）
  water: number;       // 饮水量（杯）
  mood: string;        // 心情 emoji
  note: string;        // 备注
}
