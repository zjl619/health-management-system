# 健康管理小程序

这是一个基于微信小程序的健康管理项目，包含健康打卡、饮食记录、历史查询、统计分析和用户资料维护。当前版本已完成前后端联通，后端默认使用本地 SQLite 文件存储。

## 当前能力

- 健康打卡：新增、查询、删除健康记录
- 饮食记录：按日查询、新增、删除饮食记录
- 健康统计：摘要、趋势、心情分布
- 用户模块：登录、查询个人资料、更新个人资料
- 页面模块：首页、打卡、卡路里、历史、统计、个人资料

## 当前架构

```text
health-management-system/
├─ .gitignore
├─ package.json
├─ tsconfig.json
├─ project.config.json
├─ project.private.config.json
├─ miniprogram/
│  ├─ api/                         接口请求层
│  │  ├─ request.ts                请求封装（自动附带 Authorization）
│  │  ├─ authApi.ts
│  │  ├─ healthApi.ts
│  │  ├─ dietApi.ts
│  │  └─ statsApi.ts
│  ├─ services/                    业务服务层
│  │  ├─ authService.ts
│  │  ├─ healthService.ts
│  │  ├─ dietService.ts
│  │  └─ statsService.ts
│  ├─ models/                      前端类型定义
│  │  ├─ user.ts
│  │  ├─ health.ts
│  │  └─ diet.ts
│  ├─ pages/                       页面
│  │  ├─ index/                    首页
│  │  ├─ checkin/                  健康打卡页
│  │  ├─ calorie/                  饮食记录页
│  │  ├─ history/                  历史记录页
│  │  ├─ stats/                    统计页
│  │  └─ profile/                  个人资料页
│  ├─ components/                  组件
│  ├─ custom-tab-bar/              自定义 TabBar
│  ├─ config/                      前端配置
│  │  ├─ api.ts                    后端地址配置
│  │  └─ food.ts                   内置食物库配置
│  ├─ app.ts                       启动与默认登录
│  └─ app.json                     页面与 TabBar 注册
├─ docs/
│  └─ DEVELOPMENT_UPDATE_LOG.md
├─ server/
│  ├─ app.js                       后端服务入口
│  ├─ routes/                      路由层
│  │  ├─ auth.js
│  │  ├─ users.js
│  │  ├─ health.js
│  │  ├─ diet.js
│  │  └─ stats.js
│  ├─ middlewares/
│  │  └─ auth.js                   鉴权中间件
│  ├─ utils/
│  │  └─ token.js                  Token 生成与校验
│  ├─ config/
│  │  └─ db.js                     SQLite 初始化与查询封装
│  ├─ data/
│  │  └─ health-app.sqlite         SQLite 数据文件
│  └─ sql/                         SQLite 参考脚本
│     ├─ init.sql
│     ├─ upgrade_add_users.sql
│     └─ upgrade_float_to_decimal.sql
├─ typings/
└─ README.md
```

前端调用链：pages -> services -> api -> backend

后端调用链：routes -> db(config/db.js) -> SQLite

## 技术栈

- 微信小程序 + TypeScript + SCSS
- Node.js + Express
- SQLite（sql.js）

## 快速启动

1. 安装 Node.js 18 及以上版本。
2. 进入 server 目录并安装依赖。
3. 启动后端服务。
4. 用微信开发者工具打开项目根目录并编译小程序。

示例命令：

```powershell
cd server
npm install
npm run dev
```

如果你的 PowerShell 阻止 npm.ps1，可改用：

```powershell
cd server
D:\node.js\npm.cmd install
D:\node.js\npm.cmd run dev
```

## 接口概览

- 鉴权与用户
	- POST /api/auth/login
	- GET /api/users/me
	- PUT /api/users/me
- 健康记录
	- GET /api/health/records
	- GET /api/health/records/:date
	- POST /api/health/records
	- DELETE /api/health/records/:date
	- GET /api/health/month/:year/:month
- 饮食记录
	- GET /api/diet/records/:date
	- POST /api/diet/records
	- DELETE /api/diet/records/:id
	- GET /api/diet/foods
- 统计
	- GET /api/stats/summary
	- GET /api/stats/trends
	- GET /api/stats/mood-distribution

## 数据说明

- SQLite 文件路径：server/data/health-app.sqlite
- 表结构由后端启动时自动初始化
- server/sql/init.sql 与 server/sql/upgrade_add_users.sql 是 SQLite 参考脚本

## 文档索引

- 本次改进记录：docs/DEVELOPMENT_UPDATE_LOG.md

## 已知边界

- 当前为课程实践实现，登录使用本地 openid 方案，尚未接微信真实登录
- 食物库仍以内置数据为主，后台维护能力可继续扩展
- 同步冲突处理和自动化测试尚未完整覆盖


