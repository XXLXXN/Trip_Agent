import { NextRequest, NextResponse } from "next/server";
import { formatDateForBackend, convertTrafficData } from "../../lib/formatters";

export async function POST(request: NextRequest) {
  try {
    const trafficData = await request.json();

    // 验证必需字段
    const requiredFields = ["departure", "destination", "departureTime"];
    const missingFields = requiredFields.filter(
      (field) => !(field in trafficData)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `缺少必需字段: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // 构建后端请求数据 - 根据新的CreateTrafficRequest格式
    const backendData = {
      departure_city: trafficData.departure,
      destination_city: trafficData.destination,
      departure_date: formatDateForBackend(trafficData.departureTime),
      return_date: formatDateForBackend(trafficData.departureTime), // 使用出发日期作为返回日期
      traffic_budget: null, // 设为null，因为后端允许可选
      traffic_level: "standard", // 默认交通等级
      travellers_count: {
        travellers: {
          成人: 2, // 默认成人数量
          老人: 0,
          儿童: 0,
          学生: 0,
        },
      },
    };

    console.log("发送交通推荐请求到后端:", backendData);

    // 发送到后端API
    const backendResponse = await fetch(
      "http://127.0.0.1:8002/api/traffic-recommendation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      }
    );

    if (!backendResponse.ok) {
      console.error("后端响应状态:", backendResponse.status);
      const errorText = await backendResponse.text();
      console.error("后端错误响应:", errorText);
      throw new Error(`后端服务错误: ${backendResponse.status} - ${errorText}`);
    }

    const result = await backendResponse.json();
    console.log("后端API返回结果:", result);

    // 将后端数据转换为前端期望的TrafficRecommendation[]格式
    const convertedData = convertBackendToTrafficRecommendations(result);
    console.log("转换后的交通推荐数据:", convertedData);

    // 应用时间格式化
    const formattedData = convertTrafficData(convertedData);
    console.log("格式化后的交通推荐数据:", formattedData);

    // 包装响应以符合前端期望的格式
    return NextResponse.json(
      {
        success: true,
        data: formattedData,
        message: "交通推荐成功",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API路由错误:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "服务器内部错误，请稍后重试",
      },
      { status: 500 }
    );
  }
}

// 辅助函数：将后端数据转换为TrafficRecommendation[]格式
function convertBackendToTrafficRecommendations(backendData: any): any[] {
  const trafficRecommendations: any[] = [];

  // 处理飞机数据
  if (backendData.data?.voyage?.flights) {
    backendData.data.voyage.flights.forEach((flight: any) => {
      trafficRecommendations.push({
        type: "flight",
        flightNo: flight.flightNo,
        airlineCompany: flight.airlineCompany,
        airlineCode: flight.airlineCode,
        fromAirportName: flight.fromAirportName,
        toAirportName: flight.toAirportName,
        fromDateTime: flight.fromDateTime,
        toDateTime: flight.toDateTime,
        flyDuration: flight.flyDuration,
        cabins: flight.cabins,
      });
    });
  }

  // 处理火车数据
  if (backendData.data?.trainLines) {
    backendData.data.trainLines.forEach((train: any) => {
      trafficRecommendations.push({
        type: "train",
        trainCode: train.trainCode,
        trainNo: train.trainNo,
        fromStation: train.fromStation,
        toStation: train.toStation,
        fromTime: train.fromTime,
        toTime: train.toTime,
        fromDateTime: train.fromDateTime,
        toDateTime: train.toDateTime,
        runTime: train.runTime,
        trainsType: train.trainsType,
        trainsTypeName: train.trainsTypeName,
        Seats: train.Seats,
      });
    });
  }

  console.log(
    `转换完成：飞机 ${
      backendData.data?.voyage?.flights?.length || 0
    } 条，火车 ${backendData.data?.trainLines?.length || 0} 条，总计 ${
      trafficRecommendations.length
    } 条`
  );

  return trafficRecommendations;
}
