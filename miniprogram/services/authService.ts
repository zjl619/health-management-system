import * as authApi from '../api/authApi';
import { UserProfile } from '../models/user';

const AUTH_TOKEN_KEY = 'AUTH_TOKEN';
const USER_PROFILE_KEY = 'USER_PROFILE';
const OPEN_ID_KEY = 'LOCAL_OPENID';

function ensureLocalOpenId(): string {
    const cached = wx.getStorageSync(OPEN_ID_KEY) as string;
    if (cached) return cached;
    const openid = `local_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    wx.setStorageSync(OPEN_ID_KEY, openid);
    return openid;
}

export function getToken(): string {
    return (wx.getStorageSync(AUTH_TOKEN_KEY) as string) || '';
}

export function getLocalProfile(): UserProfile | null {
    return (wx.getStorageSync(USER_PROFILE_KEY) as UserProfile) || null;
}

export async function loginDefaultUser(): Promise<UserProfile> {
    const openid = ensureLocalOpenId();
    const result = await authApi.login({ openid, nickname: '微信用户' });
    wx.setStorageSync(AUTH_TOKEN_KEY, result.token);
    wx.setStorageSync(USER_PROFILE_KEY, result.user);
    return result.user;
}

export async function fetchProfile(): Promise<UserProfile> {
    const profile = await authApi.fetchMe();
    wx.setStorageSync(USER_PROFILE_KEY, profile);
    return profile;
}

export async function updateProfile(payload: { nickname: string; avatar?: string; gender?: string }): Promise<UserProfile> {
    const profile = await authApi.updateMe(payload);
    wx.setStorageSync(USER_PROFILE_KEY, profile);
    return profile;
}
