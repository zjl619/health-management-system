import { get, post, put } from './request';
import { LoginResponse, UserProfile } from '../models/user';

export function login(payload: { openid: string; nickname?: string; avatar?: string; gender?: string }): Promise<LoginResponse> {
    return post<LoginResponse>('/auth/login', payload);
}

export function fetchMe(): Promise<UserProfile> {
    return get<UserProfile>('/users/me');
}

export function updateMe(payload: { nickname: string; avatar?: string; gender?: string }): Promise<UserProfile> {
    return put<UserProfile>('/users/me', payload);
}
