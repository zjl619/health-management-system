# 健康打卡小程序

这是一个基于微信小程序的健康管理项目，围绕健康打卡、饮食记录、历史查询和统计分析展开。项目使用 TypeScript 编写业务逻辑，样式采用 SCSS，数据主要保存在小程序本地缓存中，适合课程实践、作品展示和原型演示。

## 项目功能

- 健康打卡：记录体温、运动、睡眠、饮水、心情和备注
- 饮食管理：查询食物、计算营养、记录每日三餐与加餐
- 历史记录：按月查看打卡历史，支持删除记录
- 健康统计：展示健康评分、连续打卡、本周概览和个性化建议
- 自定义界面：支持自定义底部 TabBar 和顶部导航栏

## 项目结构

```text
health-management-system/
├─ miniprogram/
│  ├─ app.ts
│  ├─ app.json
│  ├─ app.scss
│  ├─ components/
│  │  └─ navigation-bar/
│  ├─ custom-tab-bar/
│  ├─ pages/
│  │  ├─ index/
│  │  ├─ checkin/
│  │  ├─ calorie/
│  │  ├─ history/
│  │  ├─ stats/
│  │  └─ logs/
│  ├─ utils/
│  │  ├─ storage.ts
│  │  ├─ foodData.ts
│  │  └─ util.ts
│  └─ sitemap.json
├─ typings/
│  ├─ index.d.ts
│  └─ types/
├─ package.json
├─ tsconfig.json
└─ README.md
```

关键目录说明：

- `miniprogram/pages/`：业务页面目录（首页、打卡、饮食、历史、统计等）
- `miniprogram/components/navigation-bar/`：自定义顶部导航栏组件
- `miniprogram/custom-tab-bar/`：自定义底部 TabBar
- `miniprogram/utils/storage.ts`：本地缓存读写与健康数据统计
- `miniprogram/utils/foodData.ts`：食物数据与营养计算逻辑
- `typings/`：小程序 TypeScript 类型声明

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

- 优化页面交互与视觉表现
- 提升表单校验和输入体验
- 为统计逻辑补充测试
- 拆分更细的业务层与数据层
- 增加数据导入导出能力


