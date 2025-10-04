// 测试前端API路由
const testData = {
  arr_date: "2025.8.24",
  return_date: "2025.8.30",
  travellers_count: {
    travellers: {
      成人: 2,
      老人: 1,
      儿童: 0,
      学生: 0,
    },
  },
  spot_info: [
    {
      name: "故宫博物院",
      id: "B000A7BM4H",
      address: "中国最大的古代文化艺术博物馆",
    },
  ],
};

fetch("/api/hotel-recommendation", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testData),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("API响应:", data);
  })
  .catch((error) => {
    console.error("API错误:", error);
  });
