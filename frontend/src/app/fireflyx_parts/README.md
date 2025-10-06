# fireflyx_parts

隔离的前端开发空间：所有页面与组件都放在该目录内，不改动其它目录。页面路径如下：
localhost:3000/fireflyx_parts/interactive
localhost:3000/fireflyx_parts/trip_payment/confirm
localhost:3000/fireflyx_parts/trip_payment/details
localhost:3000/fireflyx_parts/current

## 📁 目录结构

```
fireflyx_parts/
├── api/                 # API 路由
│   ├── accounting/      # 记账 API
│   │   └── route.ts    # 记账数据 CRUD 操作
│   └── trip-data/       # 行程数据 API
│       └── route.ts    # 行程数据获取
├── components/          # 跨页面复用组件
│   ├── ArrowLeft.tsx    # 左箭头图标组件
│   ├── Button.tsx       # 通用按钮组件
│   ├── Card.tsx         # 通用卡片组件
│   ├── FixedBottomBar.tsx # 底部固定输入栏
│   ├── FixedBottomButton.tsx # 底部固定按钮
│   ├── Icons.tsx        # 图标组件集合
│   ├── ItineraryCard.tsx # 行程卡片组件
│   ├── PageContainer.tsx # 通用页面容器
│   ├── PageHeader.tsx   # 通用页面头部
│   ├── PillIconButton.tsx # 药丸形状图标按钮
│   ├── SpotCardForList.tsx # 景点卡片组件（列表用）
│   ├── TransportButton.tsx # 交通选项按钮组件
│   └── index.ts         # 组件导出索引
├── config/              # 配置文件
│   └── accounting.ts    # 记账功能配置
├── current/             # 当前行程模块
│   ├── page.tsx         # 主页面（行程表/账本/建议）
│   ├── schedule/page.tsx # 行程表子页面
│   ├── account/page.tsx # 账本子页面
│   └── suggestions/page.tsx # 建议子页面
├── hooks/               # 自定义 Hooks
│   ├── useAccountingData.ts # 记账数据管理 Hook
│   └── useTripData.ts   # 行程数据获取 Hook
├── interactive/         # 联系客服模块
│   ├── page.tsx         # 客服聊天页面
│   ├── layout.tsx       # 页面布局
│   └── faq/[slug]/page.tsx # FAQ 详情页面
├── trip_payment/        # 支付相关模块（重命名）
│   ├── details/page.tsx # 行程详情/预订页面
│   └── confirm/page.tsx # 支付确认页面
├── types/               # 类型定义
│   └── tripData.ts      # 行程数据类型
├── utils/               # 工具函数
│   └── dataConverter.ts # 数据转换工具
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
- **支付详情**: `/fireflyx_parts/trip_payment/details` → 行程详情/预订页面
- **支付确认**: `/fireflyx_parts/trip_payment/confirm` → 支付确认页面

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

## 📊 数据源管理

### 当前数据源

项目使用动态数据源，从后端 JSON 文件读取行程数据：

- **数据文件位置**: `backend/DataDefinition/SAMPLE_TRIP_DATA_2.json`
- **API 路由**: `/fireflyx_parts/api/trip-data`
- **Hook**: `useTripData()` - 用于获取行程数据

### 行程表修改数据源方法（当前数据源为backend/DataDefinition/SAMPLE_TRIP_DATA2.json，必须为json文件）

#### 方法一：替换现有数据文件

1. **备份当前数据**：
   ```bash
   cp backend/DataDefinition/SAMPLE_TRIP_DATA_2.json backend/DataDefinition/SAMPLE_TRIP_DATA_2_backup.json
   ```

2. **替换数据文件**：
   ```bash
   # 将新的数据文件复制到指定位置
   cp /path/to/your/new_data.json backend/DataDefinition/SAMPLE_TRIP_DATA_2.json
   ```

3. **重启开发服务器**：
   ```bash
   cd frontend
   npm run dev
   ```

#### 方法二：创建新的数据文件

1. **创建新的数据文件**：
   ```bash
   # 在 backend/DataDefinition/ 目录下创建新文件
   touch backend/DataDefinition/SAMPLE_TRIP_DATA_3.json
   ```

2. **修改 API 路由**：
   ```typescript
   // 编辑 frontend/src/app/fireflyx_parts/api/trip-data/route.ts
   const filePath = path.join(process.cwd(), 'backend/DataDefinition/SAMPLE_TRIP_DATA_3.json');
   ```

3. **更新 Hook（可选）**：
   ```typescript
   // 如果需要使用不同的 Hook，可以修改页面组件
   import { useTripData } from "../../hooks/useTripData"; // 改为 useTripData3
   ```

#### 方法三：动态切换数据源

1. **修改 API 路由支持参数**：
   ```typescript
   // 在 route.ts 中添加查询参数支持
   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url);
     const dataSource = searchParams.get('source') || 'SAMPLE_TRIP_DATA_2';
     const filePath = path.join(process.cwd(), `backend/DataDefinition/${dataSource}.json`);
   }
   ```

2. **更新 Hook 支持参数**：
   ```typescript
   // 修改 useTripData Hook 支持数据源参数
   export const useTripData = (source: string = 'SAMPLE_TRIP_DATA_2') => {
     const response = await fetch(`/fireflyx_parts/api/trip-data?source=${source}`);
   }
   ```

### 数据格式要求

确保新的数据文件符合以下格式：

```json
{
  "user_id": "string",
  "days": [
    {
      "day_index": 1,
      "activities": [
        {
          "id": "string",
          "type": "transportation" | "activity" | "food" | "shopping",
          "mode": "plane" | "train" | "bus" | "walk" | "cycling" | "driving" | "hotel" | "attraction",
          "title": "string",
          "description": "string",
          "start_time": "HH:MM",
          "end_time": "HH:MM",
          "cost": number,
          "origin": { "name": "string" },
          "destination": { "name": "string" }
        }
      ]
    }
  ]
}
```

### 数据分类规则

- **交通费用**: `type: "transportation"` + `mode: "plane" | "train"`
- **票务费用**: `type: "activity"` + `mode: !"hotel"`
- **住宿费用**: `type: "activity"` + `mode: "hotel"`
- **美食费用**: `type: "food"`
- **购物费用**: `type: "shopping"`

### 调试数据加载

如果数据加载失败，检查以下内容：

1. **文件路径**：确保 JSON 文件在正确位置
2. **文件格式**：确保 JSON 格式正确，无语法错误
3. **API 路由**：检查 `/fireflyx_parts/api/trip-data` 是否正常响应
4. **控制台错误**：查看浏览器控制台的错误信息
5. **网络请求**：检查 Network 标签页中的 API 请求状态

## 📝 记账功能

### 功能概述

记账功能允许用户在账本页面手动添加消费记录，支持五个类别：票务、住宿、美食、购物、交通。

### 使用方法

1. **打开记账模态**：在账本页面点击"继续记账"按钮
2. **选择类别**：点击对应的类别按钮（票务、住宿、美食、购物、交通）
3. **填写信息**：输入名称、描述（可选）、金额
4. **保存记录**：点击"保存"按钮，保存后自动关闭模态

### 界面特性

- **集成式设计**：记账功能作为account页面的模态组件，无需页面跳转
- **半覆盖效果**：记账模态从底部滑出，占据屏幕的60%高度，上半部分仍可看到account页面
- **点击外部关闭**：点击页面外部区域可关闭记账模态
- **简化类别**：五个类别按钮排成一行，无emoji图标
- **自动关闭**：保存成功后自动关闭模态

### 自动清除配置

记账记录的自动清除行为通过代码配置控制，开发者可以修改 `config/accounting.ts` 文件：

```typescript
export const ACCOUNTING_CONFIG = {
  // 是否在关闭账本页面时自动清除记账记录
  // true: 自动清除（默认）
  // false: 不清除，保留记录
  AUTO_CLEAR_ON_PAGE_CLOSE: false,
  
  // 是否在组件卸载时清除记录
  // true: 清除（默认）
  // false: 不清除
  AUTO_CLEAR_ON_UNMOUNT: false,
  
  // 是否在页面刷新时清除记录
  // true: 清除（默认）
  // false: 不清除
  AUTO_CLEAR_ON_REFRESH: false,
  
  // 是否在服务器关闭时清除记录
  // true: 清除（新增）
  // false: 不清除
  AUTO_CLEAR_ON_SERVER_SHUTDOWN: true,
  
  // 是否在页面切换时清除记录（新增）
  // true: 清除
  // false: 不清除（推荐）
  AUTO_CLEAR_ON_PAGE_NAVIGATION: false,
} as const;

```

### 数据存储

- **本地存储**：`localStorage` 中的 `accounting_records`
- **服务器文件**：`backend/DataDefinition/accounting_records.json`
- **API 路由**：`/fireflyx_parts/api/accounting`

### 调整自动清除设置

记账记录的自动清除行为通过修改 `frontend/src/app/fireflyx_parts/config/accounting.ts` 文件来控制：

#### 文件位置
```
frontend/src/app/fireflyx_parts/config/accounting.ts
```

#### 配置选项

```typescript
export const ACCOUNTING_CONFIG = {
  // 关闭账本页面时是否自动清除记录
  AUTO_CLEAR_ON_PAGE_CLOSE: false,
  
  // 组件卸载时是否清除记录
  AUTO_CLEAR_ON_UNMOUNT: false,
  
  // 页面刷新时是否清除记录
  AUTO_CLEAR_ON_REFRESH: false,
};
```

#### 修改方法

**当前配置（默认）：关闭服务器时清除所有记录**：
```typescript
export const ACCOUNTING_CONFIG = {
  AUTO_CLEAR_ON_PAGE_CLOSE: false,  // 关闭页面时不清除
  AUTO_CLEAR_ON_UNMOUNT: false,    // 组件卸载时不清除
  AUTO_CLEAR_ON_REFRESH: false,    // 页面刷新时不清除
  AUTO_CLEAR_ON_SERVER_SHUTDOWN: true, // 服务器关闭时不清除
};
```

**如果需要启用自动清除**：
```typescript
export const ACCOUNTING_CONFIG = {
  AUTO_CLEAR_ON_PAGE_CLOSE: true,   // 关闭页面时清除
  AUTO_CLEAR_ON_UNMOUNT: true,     // 组件卸载时清除
  AUTO_CLEAR_ON_REFRESH: true,     // 页面刷新时清除
};
```

**混合配置示例**：
```typescript
export const ACCOUNTING_CONFIG = {
  AUTO_CLEAR_ON_PAGE_CLOSE: false,     // 关闭页面时不清除
  AUTO_CLEAR_ON_UNMOUNT: false,        // 组件卸载时不清除
  AUTO_CLEAR_ON_REFRESH: true,         // 页面刷新时清除
  AUTO_CLEAR_ON_SERVER_SHUTDOWN: true, // 服务器关闭时清除
};
```

#### 服务器关闭时清除

当 `AUTO_CLEAR_ON_SERVER_SHUTDOWN` 设置为 `true` 时，系统会在以下情况下自动清除记账记录：

- **关闭开发服务器**：使用 `Ctrl+C` 或关闭终端时
- **关闭浏览器标签页**：关闭包含账本页面的标签页时
- **刷新页面**：刷新包含账本页面的页面时

**技术实现**：
- **服务器进程监听**：
  - 监听 `SIGINT` 和 `SIGTERM` 信号（服务器关闭时触发）
  - 自动清除记账记录文件
- **浏览器页面监听**：
  - 监听 `beforeunload` 事件（页面卸载时触发）
  - 使用 `navigator.sendBeacon()` API 发送清除请求
- **API 支持**：
  - POST 请求支持清除指令 (`action: 'clear'`)
  - HEAD 请求用于健康检查

#### 存储文件信息

- **记账记录文件**：`backend/DataDefinition/accounting_records.json`
- **文件格式**：JSON 数组格式
- **文件位置**：项目根目录下的 `backend/DataDefinition/` 文件夹
- **文件内容示例**：
```json
[
  {
    "id": "1703123456789",
    "category": "tickets",
    "name": "故宫门票",
    "description": "成人票",
    "amount": 60,
    "timestamp": "2023-12-21T10:30:00.000Z"
  }
]
```

## 🎤 语音识别功能

### 功能概述

项目集成了语音识别功能，支持长按麦克风按钮进行语音输入，适用于以下页面：
- `/fireflyx_parts/interactive` - 客服聊天页面
- `/fireflyx_parts/current/schedule` - 行程表页面
- `/fireflyx_parts/trip_payment/details` - 支付详情页面

### 使用方法

1. **长按麦克风图标**：在输入框右侧的麦克风按钮上长按
2. **开始录音**：按钮变为红色，表示正在录音
3. **松开停止**：松开按钮停止录音，语音内容自动转换为文字
4. **自动填充**：转换的文字会自动添加到输入框中

### 技术实现

- **API**: 使用 Web Speech API (`SpeechRecognition` 或 `webkitSpeechRecognition`)
- **语言**: 设置为中文 (`zh-CN`)
- **触发方式**: 支持鼠标和触摸事件 (`onMouseDown`, `onTouchStart`)
- **状态管理**: 录音状态通过 `isRecording` 状态控制
- **错误处理**: 包含语音识别错误处理和状态重置

### 浏览器兼容性

- **Chrome**: 完全支持
- **Safari**: 支持（需要 HTTPS）
- **Firefox**: 部分支持
- **Edge**: 支持

## 🎬 动画系统

### 页面过渡动画

项目使用 `framer-motion` 实现页面过渡效果：

- **页面切换**: 支持淡入淡出和滑动效果
- **组件动画**: 按钮点击、卡片展开等交互动画
- **模态动画**: 记账模态从底部滑出效果

### 动画配置

```typescript
// 页面过渡动画
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

// 模态动画
const modalVariants = {
  hidden: { y: "100%" },
  visible: { y: 0 }
};
```

## 🛠️ 工具函数

### 数据转换工具 (`utils/dataConverter.ts`)

提供数据格式转换功能：

- **`convertToItineraryData`**: 将动态数据转换为行程卡片格式
- **`convertToSpotCardData`**: 将活动数据转换为景点卡片格式
- **`getTransportOptions`**: 获取交通选项列表
- **`formatTime`**: 时间格式化工具
- **`getFirstActivityTime`**: 获取第一天第一个活动的时间

### 类型定义 (`types/tripData.ts`)

定义完整的数据类型系统：

- **`TripData`**: 行程主数据结构
- **`DayData`**: 单日行程数据
- **`ActivityData`**: 活动详情数据
- **`LocationData`**: 地点信息数据

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

## 🔧 开发工具

### 自定义 Hooks

- **`useTripData`**: 获取行程数据，支持加载状态和错误处理
- **`useAccountingData`**: 管理记账数据，支持增删改查操作

### API 路由

- **`/fireflyx_parts/api/trip-data`**: 获取行程数据
- **`/fireflyx_parts/api/accounting`**: 记账数据 CRUD 操作

### 构建脚本

- **`scripts/fetch-figma.js`**: Figma 数据获取脚本
- **`scripts/figma.config.json`**: Figma 配置文件
