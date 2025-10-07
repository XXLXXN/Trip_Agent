import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 直接读取 SAMPLE_TRIP_DATA_2.json 文件
export async function GET() {
  try {
    // 使用相对于项目根目录的路径
    const jsonFilePath = path.join(
      process.cwd(),
      "..",
      "backend/DataDefinition/SAMPLE_TRIP_DATA_2.json"
    );
    console.log("Looking for file at:", jsonFilePath);

    // 检查文件是否存在
    if (!fs.existsSync(jsonFilePath)) {
      console.error("File does not exist at:", jsonFilePath);
      return NextResponse.json(
        { error: `File not found at ${jsonFilePath}` },
        { status: 404 }
      );
    }

    // 读取 JSON 文件内容
    const jsonContent = fs.readFileSync(jsonFilePath, "utf-8");

    // 处理 Python 风格的 None 值
    const processedContent = jsonContent.replace(/None/g, "null");

    // 直接解析 JSON
    const tripData = JSON.parse(processedContent);

    return NextResponse.json(tripData);
  } catch (error) {
    console.error("Error reading SAMPLE_TRIP_DATA_2.json:", error);
    return NextResponse.json(
      { error: "Failed to read SAMPLE_TRIP_DATA_2.json file" },
      { status: 500 }
    );
  }
}
