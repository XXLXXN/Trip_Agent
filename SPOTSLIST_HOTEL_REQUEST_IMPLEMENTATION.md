# Spotslist 酒店推荐请求实现文档

## 概述

本文档描述了在 spotslist 页面点击"下一步"时，如何构造并发送酒店推荐请求给后端。

## 实现的功能

1. **创建了新的 API 路由**：`/api/hotel-recommendation`
2. **修改了 TripPlanContext**：添加了保存和获取用户选择的景点信息的功能
3. **修改了 spotslist 页面**：实时保存用户选择的景点完整信息到上下文
4. **修改了 BottomNav 组件**：在点击"下一步"时发送酒店推荐请求

## 数据结构

### 发送给后端的请求数据格式（CreateHotelRequest）

```typescript
{
  hotel_budget: null,           // 可选，设为null
  hotel_level: null,            // 可选，设为null
  arr_date: "2025-08-24",       // 到达日期（从行程规划数据获取）
  return_date: "2025-08-30",    // 返回日期（从行程规划数据获取）
  travellers_count: {           // 旅行者人数信息
    travellers: {
      成人: 2,                   // 成人数
      老人: 1,                   // 老人数
      儿童: 0,                   // 儿童数
      学生: 0                    // 学生数
    }
  },
  spot_info: [                  // 用户选择的景点信息
    {
      name: "故宫博物院",        // 景点名称
      id: "B000A7BM4H",         // POI ID
      address: "中国最大的古代文化艺术博物馆" // 景点地址
    },
    // ... 更多景点
  ]
}
```

### 保存在上下文中的景点完整信息（SpotDetailInfo）

```typescript
{
  SpotName: "故宫博物院",
  RecReason: "中国最大的古代文化艺术博物馆",
  POIId: "B000A7BM4H",
  description: "详细描述...",
  address: "地址信息",
  photos: [{ url: "...", title: "..." }],
  rating: "4.8"
}
```

## 实现细节

### 1. API 路由 (`/api/hotel-recommendation`)

- 验证必需字段：`arr_date`, `return_date`, `travellers_count`, `spot_info`
- 转换日期格式为后端期望的格式（YYYY-MM-DD）
- 发送请求到后端 API（假设端口为 8000）
- 处理响应和错误

### 2. TripPlanContext 增强

新增功能：

- `saveSelectedSpots()`: 保存用户选择的完整景点信息
- `getSelectedSpots()`: 获取保存的景点信息

### 3. Spotslist 页面修改

- 添加了`poiId`和`address`字段到转换后的景点数据
- 使用`useEffect`监听选择状态变化，实时保存完整景点信息到上下文
- 默认选择所有推荐的景点

### 4. BottomNav 组件修改

- 从上下文获取用户选择的景点信息，而不是从推荐列表
- 添加了加载状态和错误处理
- 发生错误时显示错误信息并提供重试功能
- 只在请求成功后才导航到交通页面

## 错误处理

- **数据缺失错误**：当缺少行程规划数据或景点选择数据时显示错误
- **API 请求错误**：显示后端返回的错误信息
- **网络错误**：显示网络连接错误
- **重试机制**：提供重试按钮让用户重新发送请求

## 示例数据文件

创建了`POST_REQUEST_EXAMPLE_HOTEL.json`文件，展示了正确的请求数据结构，使用真实的 POI ID 和景点信息。

## 使用说明

1. 用户在 spotslist 页面选择景点（默认全选）
2. 点击"下一步"按钮
3. 系统自动保存选择的景点完整信息到上下文
4. 发送酒店推荐请求到后端
5. 请求成功后导航到交通页面
6. 如果失败，显示错误信息并提供重试选项

## 注意事项

- 后端 API 端点假设为`http://localhost:8000/api/hotel-recommendation`
- 日期格式会自动从前端格式（2025.8.24）转换为后端格式（2025-08-24）
