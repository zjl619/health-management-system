# 后端架构设计文档

## 1. 目标

当前项目是一个纯前端微信小程序，健康记录和饮食记录都依赖本地缓存。为了支持后续扩展，建议引入后端服务，形成“前端页面 + API 层 + 后端业务层 + 数据库”的架构。

引入后端后的目标：

- 支持多设备同步
- 支持用户登录与身份绑定
- 支持云端持久化存储
- 支持统计数据统一计算
- 支持食物库集中维护

## 2. 推荐总体架构

```text
微信小程序前端
├─ pages/          页面展示与交互
├─ services/       业务调用封装
├─ api/            请求封装与接口定义
├─ models/         类型定义
└─ utils/          日期、格式化等通用工具

后端服务
├─ controllers/    接口控制层
├─ services/       业务逻辑层
├─ repositories/   数据访问层
├─ models/         数据模型
├─ middlewares/    鉴权、错误处理等中间件
└─ config/         环境配置

数据库
├─ users           用户表
├─ health_records  健康打卡表
├─ diet_records    饮食记录表
├─ foods           食物库表
└─ sync_logs       同步日志表
```

## 3. 前端建议改造

### 3.1 新增前端目录

```text
miniprogram/
├─ api/
│  ├─ request.ts
│  ├─ authApi.ts
│  ├─ healthApi.ts
│  ├─ dietApi.ts
│  └─ statsApi.ts
├─ services/
│  ├─ authService.ts
│  ├─ healthService.ts
│  ├─ dietService.ts
│  └─ statsService.ts
├─ models/
│  ├─ user.ts
│  ├─ health.ts
│  ├─ diet.ts
│  └─ stats.ts
└─ utils/
```

### 3.2 前端职责变化

- `pages/` 只负责 UI 和事件响应。
- `services/` 负责组合业务流程，比如新增打卡后刷新首页数据。
- `api/` 负责和后端通信，不包含业务判断。
- `models/` 统一管理类型，避免页面里重复定义接口。

### 3.3 页面调用方式

例如打卡页不再直接写本地缓存，而是：

1. 页面收集表单数据。
2. `healthService` 校验并组装请求。
3. `healthApi` 调用后端接口。
4. 成功后刷新本地缓存或重新拉取数据。

## 4. 后端目录结构建议

如果使用 Node.js + TypeScript，可以采用以下结构：

```text
backend/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ config/
│  │  ├─ env.ts
│  │  └─ database.ts
│  ├─ controllers/
│  │  ├─ authController.ts
│  │  ├─ userController.ts
│  │  ├─ healthController.ts
│  │  ├─ dietController.ts
│  │  ├─ foodController.ts
│  │  └─ statsController.ts
│  ├─ services/
│  │  ├─ authService.ts
│  │  ├─ userService.ts
│  │  ├─ healthService.ts
│  │  ├─ dietService.ts
│  │  ├─ foodService.ts
│  │  └─ statsService.ts
│  ├─ repositories/
│  │  ├─ userRepository.ts
│  │  ├─ healthRepository.ts
│  │  ├─ dietRepository.ts
│  │  ├─ foodRepository.ts
│  │  └─ syncRepository.ts
│  ├─ models/
│  │  ├─ User.ts
│  │  ├─ HealthRecord.ts
│  │  ├─ DietEntry.ts
│  │  └─ FoodItem.ts
│  ├─ middlewares/
│  │  ├─ authMiddleware.ts
│  │  ├─ errorMiddleware.ts
│  │  └─ validateMiddleware.ts
│  ├─ routes/
│  │  ├─ authRoutes.ts
│  │  ├─ userRoutes.ts
│  │  ├─ healthRoutes.ts
│  │  ├─ dietRoutes.ts
│  │  ├─ foodRoutes.ts
│  │  └─ statsRoutes.ts
│  └─ utils/
│     ├─ logger.ts
│     ├─ response.ts
│     └─ date.ts
├─ tests/
└─ package.json
```

## 5. 数据表设计建议

### 5.1 用户表 `users`

建议字段：

- `id`
- `openid` 或第三方登录标识
- `nickname`
- `avatar`
- `gender`
- `created_at`
- `updated_at`

### 5.2 健康记录表 `health_records`

建议字段：

- `id`
- `user_id`
- `date`
- `temp`
- `status`
- `exercise`
- `sleep`
- `water`
- `mood`
- `note`
- `created_at`
- `updated_at`
- `version`

### 5.3 饮食记录表 `diet_records`

建议字段：

- `id`
- `user_id`
- `date`
- `food_id`
- `food_name`
- `grams`
- `calories`
- `protein`
- `carbs`
- `fat`
- `meal`
- `created_at`
- `updated_at`

### 5.4 食物表 `foods`

建议字段：

- `id`
- `name`
- `category`
- `unit`
- `unit_weight`
- `calories_per_100g`
- `protein_per_100g`
- `carbs_per_100g`
- `fat_per_100g`
- `enabled`

### 5.5 同步日志表 `sync_logs`

用于解决离线同步和冲突问题，建议字段：

- `id`
- `user_id`
- `record_type`
- `record_id`
- `operation`
- `payload`
- `status`
- `error_message`
- `created_at`
- `updated_at`

## 6. 接口设计建议

### 6.1 登录与用户

- `POST /auth/login`
- `GET /users/me`
- `PUT /users/me`

### 6.2 健康打卡

- `GET /health-records`
- `POST /health-records`
- `GET /health-records/:id`
- `PUT /health-records/:id`
- `DELETE /health-records/:id`

### 6.3 饮食记录

- `GET /diet-records`
- `POST /diet-records`
- `GET /diet-records/:id`
- `DELETE /diet-records/:id`

### 6.4 食物库

- `GET /foods`
- `POST /foods`
- `PUT /foods/:id`
- `DELETE /foods/:id`

### 6.5 统计数据

- `GET /stats/summary`
- `GET /stats/trends`
- `GET /stats/mood-distribution`

## 7. 数据流

推荐采用以下数据流：

1. 用户在小程序中提交表单。
2. 前端页面调用 `service` 层。
3. `service` 层调用 `api` 层请求后端。
4. 后端 `controller` 接收请求并校验参数。
5. `service` 层处理业务逻辑。
6. `repository` 层读写数据库。
7. 返回标准化响应给前端。
8. 前端更新页面和本地缓存。

## 8. 同步策略

建议保留本地缓存作为离线缓存，而不是完全移除。

推荐策略：

- 先读本地缓存，保证页面速度
- 后台再请求后端，刷新最新数据
- 新增、修改、删除时先更新本地，再同步后端
- 同步失败时记录待同步队列，网络恢复后补传
- 通过 `version` 或 `updated_at` 处理冲突

## 9. 推荐技术栈

如果后端由你自己实现，推荐以下组合：

- Node.js + TypeScript
- NestJS 或 Express
- MySQL 或 PostgreSQL
- Redis（可选，用于缓存和会话）
- JWT 或微信登录态
- Swagger/OpenAPI 用于接口文档

如果希望和微信生态更贴近，也可以使用微信云开发作为过渡方案。

## 10. 实施顺序

建议按下面顺序推进：

1. 先抽前端 `api` 和 `service` 层。
2. 先实现登录、用户和健康打卡接口。
3. 再接入饮食记录和食物库。
4. 最后做统计汇总和同步机制。
5. 最后补测试和接口文档。

## 11. 总结

这个项目如果要升级为可持续开发的完整系统，最关键的不是直接加接口，而是先把前端和数据访问层拆开。只要前端保留清晰的 `pages -> services -> api` 结构，后端无论是自建服务还是云开发，都能比较平滑地接入。
