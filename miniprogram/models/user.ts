export interface UserProfile {
    id: number;
    openid: string;
    nickname: string;
    avatar: string;
    gender: string;
    created_at: string;
    updated_at: string;
}

export interface LoginResponse {
    token: string;
    user: UserProfile;
}
