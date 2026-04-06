import * as authService from '../../services/authService';

const GENDER_OPTIONS = ['未知', '男', '女'];

Page({
    data: {
        nickname: '',
        avatar: '',
        genderOptions: GENDER_OPTIONS,
        genderIndex: 0,
        saving: false,
    },

    onShow() {
        this.loadProfile();
    },

    async loadProfile() {
        try {
            const local = authService.getLocalProfile();
            if (local) {
                this.setData({
                    nickname: local.nickname || '',
                    avatar: local.avatar || '',
                    genderIndex: this._toGenderIndex(local.gender || ''),
                });
            }
            const profile = await authService.fetchProfile();
            this.setData({
                nickname: profile.nickname || '',
                avatar: profile.avatar || '',
                genderIndex: this._toGenderIndex(profile.gender || ''),
            });
        } catch (err) {
            console.error('用户资料加载失败', err);
            wx.showToast({ title: '资料加载失败', icon: 'none' });
        }
    },

    onNicknameInput(e: WechatMiniprogram.Input) {
        this.setData({ nickname: e.detail.value });
    },

    onAvatarInput(e: WechatMiniprogram.Input) {
        this.setData({ avatar: e.detail.value });
    },

    onGenderChange(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
        this.setData({ genderIndex: parseInt(e.detail.value, 10) || 0 });
    },

    async saveProfile() {
        const nickname = this.data.nickname.trim();
        if (!nickname) {
            wx.showToast({ title: '昵称不能为空', icon: 'none' });
            return;
        }

        this.setData({ saving: true });
        try {
            await authService.updateProfile({
                nickname,
                avatar: this.data.avatar.trim(),
                gender: this.data.genderOptions[this.data.genderIndex],
            });
            wx.showToast({ title: '保存成功', icon: 'success' });
        } catch (err) {
            console.error('用户资料保存失败', err);
            wx.showToast({ title: '保存失败', icon: 'none' });
        } finally {
            this.setData({ saving: false });
        }
    },

    _toGenderIndex(gender: string) {
        const idx = GENDER_OPTIONS.findIndex((g) => g === gender);
        return idx >= 0 ? idx : 0;
    },
});
