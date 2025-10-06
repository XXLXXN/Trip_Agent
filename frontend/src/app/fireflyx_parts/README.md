# fireflyx_parts

隔离的前端开发空间：所有页面与组件都放在该目录内，不改动其它目录。页面路径如下：
localhost:3000/fireflyx_parts/interactive
localhost:3000/fireflyx_parts/payment/confirm
localhost:3000/fireflyx_parts/payment/details
localhost:3000/fireflyx_parts/current

## 📁 目录结构

```
fireflyx_parts/
├── components/           # 跨页面复用组件
│   ├── ArrowLeft.tsx    # 左箭头图标组件
│   ├── Button.tsx       # 通用按钮组件
│   ├── Card.tsx         # 通用卡片组件
│   ├── FixedBottomButton.tsx # 底部固定按钮
│   ├── Icons.tsx        # 图标组件集合
│   ├── ItineraryCard.tsx # 行程卡片组件
│   ├── PageContainer.tsx # 通用页面容器
│   ├── PageHeader.tsx   # 通用页面头部
│   ├── PillIconButton.tsx # 药丸形状图标按钮
│   ├── TransportButton.tsx # 交通选项按钮组件
│   └── index.ts         # 组件导出索引
├── current/             # 当前行程模块
│   ├── page.tsx         # 主页面（行程表/账本/建议）
│   ├── schedule/page.tsx # 行程表子页面
│   ├── account/page.tsx # 账本子页面
│   └── suggestions/page.tsx # 建议子页面
├── interactive/         # 联系客服模块
│   ├── page.tsx         # 客服聊天页面
│   ├── layout.tsx       # 页面布局
│   └── faq/[slug]/page.tsx # FAQ 详情页面
├── payment/             # 支付相关模块
│   ├── details/page.tsx # 行程详情/预订页面
│   └── confirm/page.tsx # 支付确认页面
├── data/                # 数据文件
│   └── itineraryData.ts # 行程数据
├── assets/              # 静态资源
│   ├── images/          # 图片资源
│   └── nodes/           # Figma 节点数据
├── scripts/             # 构建脚本
│   ├── fetch-figma.js   # Figma 数据获取脚本
│   └── figma.config.json # Figma 配置文件
└── page.tsx             # 入口页面（重定向到 interactive）
```

## 🎯 页面路径

### 主要页面

- **入口页面**: `/fireflyx_parts` → 重定向到 `/fireflyx_parts/interactive`
- **当前行程**: `/fireflyx_parts/current` → 主页面（行程表/账本/建议）
- **联系客服**: `/fireflyx_parts/interactive` → 客服聊天页面
- **支付详情**: `/fireflyx_parts/payment/details` → 行程详情/预订页面
- **支付确认**: `/fireflyx_parts/payment/confirm` → 支付确认页面

### 子页面

- **行程表**: `/fireflyx_parts/current/schedule` → 详细行程安排
- **账本**: `/fireflyx_parts/current/account` → 费用统计和分类管理
- **建议**: `/fireflyx_parts/current/suggestions` → 个人数据管理选项
- **FAQ 详情**: `/fireflyx_parts/interactive/faq/[slug]` → 常见问题详情页面

## 🛠️ 技术规范

### 组件开发

- 使用 TypeScript + React 18
- 所有页面组件添加 `"use client"` 指令
- 使用 Tailwind CSS 进行样式设计
- 组件放在 `components/` 目录，避免重复代码

### 样式规范

- 主色调：`#0768FD` (蓝色) 和 `#4285F4` (Google 蓝)
- 卡片样式：`rounded-[16px] border border-[rgba(1,34,118,0.05)] bg-white`
- 按钮样式：`rounded-full bg-[#0768FD] text-white` 或 `rounded-full bg-[#4285F4] text-white`
- 字体：Inter 字体族

### 交互功能

- 交通选项支持点击选择（蓝色高亮）
- 所有按钮支持移动端触摸优化
- 统一的返回按钮和导航逻辑

## 📱 移动端优化

- 使用 `env(safe-area-inset-top)` 适配刘海屏
- 交通按钮尺寸：`w-16 h-8` (64x32px)
- 添加 `touch-manipulation` 优化触摸体验
- 固定底部按钮使用 `z-50` 确保层级
- 输入框使用 `z-60` 确保在最上层

## 🎨 设计系统

### 颜色规范

- 主色：`#0768FD` (蓝色) 和 `#4285F4` (Google 蓝)
- 文字：`#1B1446` (深蓝)
- 次要文字：`#808080` (灰色)
- 背景：`#FFFFFF` (白色)
- 边框：`rgba(1,34,118,0.05)` (淡蓝)
- 占位图：`#DDDDDD` (浅灰) 和 `#D9D9D9` (中灰)

### 组件规范

- 按钮圆角：`rounded-full` (圆形) - 用于主要按钮
- 卡片圆角：`rounded-[16px]` (16px) - 用于卡片容器
- 图片圆角：`rounded-[7px]` (7px) - 用于卡片内图片
- 交通按钮：`w-16 h-8` (64x32px) - 交通选项按钮尺寸
- 间距：使用 Tailwind 间距系统
