import { get } from './request';
import { HealthRecord } from '../models/health';

export interface StatsSummary {
    healthScore: number;
    scoreTitle: string;
    streak: number;
    totalDays: number;
    nextBadgeDiff: number;
    avgExercise: number;
    avgSleep: number;
    avgWater: number;
    exercisePercent: number;
    sleepPercent: number;
    waterPercent: number;
    advices: string[];
}

export interface StatsTrends {
    tempChart: Array<{ temp: number; shortDate: string; heightPercent: string; isHigh: boolean }>;
    weeklyStats: HealthRecord[];
}

export interface MoodStat {
    mood: string;
    count: number;
    percent: number;
}

export function fetchSummary(): Promise<StatsSummary> {
    return get<StatsSummary>('/stats/summary');
}

export function fetchTrends(): Promise<StatsTrends> {
    return get<StatsTrends>('/stats/trends');
}

export function fetchMoodDistribution(): Promise<MoodStat[]> {
    return get<MoodStat[]>('/stats/mood-distribution');
}