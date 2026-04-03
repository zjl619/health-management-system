# 健康打卡小程序

这是一个基于微信小程序的健康管理项目，围绕健康打卡、饮食记录、历史查询和统计分析展开。项目使用 TypeScript 编写业务逻辑，样式采用 SCSS，数据主要保存在小程序本地缓存中，适合课程实践、作品展示和原型演示。

## 项目功能

- 健康打卡：记录体温、运动、睡眠、饮水、心情和备注
- 饮食管理：查询食物、计算营养、记录每日三餐与加餐
- 历史记录：按月查看打卡历史，支持删除记录
- 健康统计：展示健康评分、连续打卡、本周概览和个性化建议
- 自定义界面：支持自定义底部 TabBar 和顶部导航栏

## 项目结构

- miniprogram/app.ts：小程序入口文件
- miniprogram/app.json：页面路由和全局配置
- miniprogram/pages/index：健康概览首页
- miniprogram/pages/checkin：健康打卡页
- miniprogram/pages/calorie：饮食和卡路里记录页
- miniprogram/pages/history：历史记录页
- miniprogram/pages/stats：统计分析页
- miniprogram/components/navigation-bar：自定义导航栏组件
- miniprogram/custom-tab-bar：自定义底部导航栏
- miniprogram/utils/storage.ts：健康记录的本地存取与统计
- miniprogram/utils/foodData.ts：食物数据库、营养计算与饮食记录

## 技术栈

- 微信小程序
- TypeScript
- SCSS
- 小程序本地缓存 API

## 运行说明

1. 使用微信开发者工具打开本项目根目录。
2. 导入项目后，确保小程序基础配置可用。
3. 编译并预览即可运行。

## 数据说明

项目没有接入后端服务，所有健康记录和饮食记录默认保存在本地缓存中。关闭或卸载小程序后，本地数据可能会丢失，因此更适合作为单机版演示项目。

## 主要特点

- 结构清晰，页面职责划分明确
- 业务逻辑集中在 utils 层，便于维护
- 功能闭环完整，能够覆盖健康管理的常见场景
- 界面组件化，便于后续扩展

## 后续可扩展方向

- 接入云开发或后端服务，实现多设备同步
- 增加登录和用户体系
- 为统计逻辑补充测试
- 拆分更细的业务层与数据层
- 增加导出报告能力

## 后端扩展建议

如果后续要把项目升级为前后端分离架构，建议优先做下面几件事。

### 1. 重构前端分层

把当前直接操作本地缓存的逻辑，调整为“页面 -> service -> api -> 后端”的调用链。

建议新增这些前端目录：

```text
miniprogram/
├─ services/
│  ├─ authService.ts
│  ├─ healthService.ts
│  ├─ dietService.ts
│  └─ statsService.ts
├─ api/
│  ├─ request.ts
│  ├─ authApi.ts
│  ├─ healthApi.ts
│  ├─ dietApi.ts
│  └─ statsApi.ts
├─ models/
│  ├─ user.ts
│  ├─ health.ts
│  ├─ diet.ts
│  └─ stats.ts
└─ utils/
```

页面层仍然保留在 `pages/`，但不再直接读写缓存或拼装请求细节。

### 2. 拆出统一请求封装

建议新增一个通用请求模块，统一处理：

- `baseURL` 配置
- token 传递
- 超时控制
- 错误提示
- 登录失效处理

这样后续更换后端框架时，只需要调整 `api/request.ts`，页面代码基本不用改。

### 3. 后端接口建议

如果后端采用 REST 风格，可以先定义这些核心接口：

- `POST /auth/login`：登录换取 token
- `GET /users/me`：获取当前用户信息
- `GET /health-records`：获取健康记录列表
- `POST /health-records`：新增健康打卡
- `PUT /health-records/:id`：更新健康打卡
- `DELETE /health-records/:id`：删除健康打卡
- `GET /diet-records`：获取饮食记录列表
- `POST /diet-records`：新增饮食记录
- `DELETE /diet-records/:id`：删除饮食记录
- `GET /stats/summary`：获取统计汇总数据
- `GET /foods`：获取食物库数据

### 4. 建议的数据模型

为了后续做同步和多端使用，健康记录和饮食记录建议补充这些字段：

- `id`：全局唯一标识
- `userId`：所属用户
- `createdAt`：创建时间
- `updatedAt`：更新时间
- `syncStatus`：同步状态
- `version`：版本号，用于冲突处理

### 5. 本地缓存与后端同步策略

推荐保留本地缓存，作为离线兜底方案，采用以下策略：

- 页面打开时先读本地缓存，保证响应速度
- 后台异步拉取后端最新数据并刷新本地缓存
- 用户新增、编辑、删除时先更新本地，再同步后端
- 同步失败时保留待同步队列，网络恢复后补传

### 6. 优先改造顺序

建议按这个顺序推进：

1. 先把本地存储逻辑包一层 service。
2. 再新增请求封装和后端接口。
3. 先迁移健康打卡和饮食记录。
4. 最后迁移统计和食物库数据。

这样可以尽量保证旧功能还能继续运行，降低重构风险。

