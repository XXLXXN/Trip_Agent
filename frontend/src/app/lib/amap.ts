// lib/amap.ts

// 确保此模块仅在服务器端执行
import 'server-only';

/**
 * [服务器端函数] 使用高德地理编码API将地址转换为经纬度坐标。
 * @param address - 需要转换的地址字符串。
 * @returns [经度, 纬度] 数组，如果失败则返回 null。
 */
export async function getCoordinatesFromAddress(address: string): Promise<[number, number] | null> {
  // 从环境变量中安全地获取 API Key
  const apiKey = process.env.AMAP_KEY;

  if (!apiKey) {
    console.error("高德地图 API Key 未在 .env.local 文件中配置");
    return null;
  }

  const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    // 使用 Next.js 的扩展 fetch 进行请求，可以自动处理缓存
    const response = await fetch(url, { next: { revalidate: 3600 } }); // 1小时后重新验证
    const data = await response.json();

    if (data.status === '1' && data.geocodes.length > 0) {
      const location = data.geocodes[0].location;
      const [longitude, latitude] = location.split(',').map(Number);
      return [longitude, latitude]; // 高德返回的格式是 [经度, 纬度]
    } else {
      console.error("高德地理编码失败:", data.info);
      return null;
    }
  } catch (error) {
    console.error("请求高德地理编码API时出错:", error);
    return null;
  }
}