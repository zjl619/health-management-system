Page({
  data: {
    temp: 36.5,
    status: '健康'
  },
  tempChange(e:any) {
    this.setData({ temp: e.detail.value });
  },
  statusChange(e:any) {
    this.setData({ status: e.detail.value });
  },
  submitData() {
    // 获取当前日期
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    // 构造一条打卡记录
    const newRecord = {
      date: dateStr,
      temp: this.data.temp,
      status: this.data.status,
      timestamp: now.getTime()
    };

    // 获取本地已有的历史数据（如果没有，默认为空数组）
    let history = wx.getStorageSync('healthRecords') || [];
    
    // 检查今天是否已经打卡（防止重复打卡，如果不需要限制可以删掉这一段）
    const todayIndex = history.findIndex((item: any) => item.date === dateStr);
    if (todayIndex !== -1) {
      history[todayIndex] = newRecord; // 覆盖今日记录
    } else {
      history.push(newRecord); // 追加新记录
    }

    // 保存回本地缓存
    wx.setStorageSync('healthRecords', history);

    wx.showToast({
      title: '打卡成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => { wx.navigateBack(); }, 1500); // 延迟返回首页
      }
    });
  }
})