import { loginDefaultUser } from './services/authService';

App<IAppOption>({
  globalData: {},
  async onLaunch() {
    try {
      await loginDefaultUser();
    } catch (err) {
      console.error('自动登录失败', err);
    }
  },
})
