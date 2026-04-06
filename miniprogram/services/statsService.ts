import * as statsApi from '../api/statsApi';

export async function getSummary() {
    return statsApi.fetchSummary();
}

export async function getTrends() {
    return statsApi.fetchTrends();
}

export async function getMoodDistribution() {
    return statsApi.fetchMoodDistribution();
}