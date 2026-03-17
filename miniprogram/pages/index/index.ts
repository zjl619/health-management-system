Page({
  data: {
    totalDays: 0,
    safeDays: 0,
    warningDays: 0,
    chartData: []
  },

  // 每次页面展示时重新加载本地数据（保证打卡回来数据能刷新）
  onShow() {
    this.loadData();
  },

  goCheckin() {
    wx.navigateTo({ url: '/pages/checkin/checkin' });
  },

  loadData() {
    // 1. 从本地缓存读取数据
    const records = wx.getStorageSync('healthRecords') || [];
    
    // 2. 计算统计指标 (可视化1)
    const totalDays = records.length;
    const safeDays = records.filter((item: any) => item.status === '健康').length;
    const warningDays = totalDays - safeDays;

    // 3. 处理柱状图数据 (可视化2：取最近7天数据)
    // 假设温度范围在 35度 到 40度 之间，用于计算柱子高度百分比
    const chartData = records.slice(-7).map((item: any)  => {
      // 截取 MM-DD 格式
      const shortDate = item.date.substring(5); 
      // 计算高度百分比: (当前温度 - 35) / (42 - 35) * 100
      let percent = ((item.temp - 35) / 7) * 100;
      percent = Math.min(Math.max(percent, 5), 100); // 限制在 5% - 100% 之间

      return {
        temp: item.temp,
        shortDate: shortDate,
        heightPercent: percent + '%'
      }
    });

    // 4. 更新页面数据
    this.setData({ totalDays, safeDays, warningDays, chartData });
  }
})