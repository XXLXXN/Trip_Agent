import asyncio
import json
import sys
import os

# --- 关键设置：确保脚本能找到 database_operations ---
# 将项目根目录添加到 Python 路径中
# 这使得我们可以从 backend 目录内部，正确地导入 backend/database/database_operations
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# -----------------------------------------------------

from backend.database.database_operations import trip_collection, save_trip_to_db

async def main():
    """
    这个脚本用于将本地的 JSON 示例数据插入到 MongoDB 数据库中。
    它只会执行插入操作，不会删除数据。
    """
    print("--- 正在连接到数据库并准备插入数据 ---")
    
    if trip_collection is None:
        print("❌ 数据库连接失败，请检查 backend/database/database_operations.py 中的 MONGO_URI 配置。")
        return

    # 1. 动态定位并加载你的 JSON 文件
    try:
        # 构建从当前文件到目标文件的相对路径
        json_file_path = r'C:\Users\ICE\Desktop\show\trip0929\Trip_Agent\backend\DataDefinition\SAMPLE_TRIP_DATA_3.json'
        with open(json_file_path, 'r', encoding='utf-8') as f:
            sample_trip_data = json.load(f)
        print("✅ 成功加载 SAMPLE_TRIP_DATA_3.json 文件。")
    except FileNotFoundError:
        print(f"❌ 错误：在路径 '{json_file_path}' 找不到文件。请检查文件是否存在。")
        return
    except json.JSONDecodeError:
        print("❌ 错误：JSON 文件格式不正确。")
        return
        
    # 2. 检查数据是否已存在，防止重复插入
    # 我们使用 trip_id 作为唯一标识来检查
    trip_id_to_check = sample_trip_data.get("trip_id")
    
    if not trip_id_to_check:
        print("❌ 错误：JSON 文件中缺少 'trip_id' 字段，无法检查重复。")
        return
        
    existing_trip = await trip_collection.find_one({
        "trip_id": trip_id_to_check
    })
    
    if existing_trip:
        print(f"🟡 数据已存在 (trip_id: {trip_id_to_check})，跳过插入。")
    else:
        # 3. 如果数据不存在，则插入数据
        print(f"正在尝试插入行程: '{sample_trip_data.get('trip_name')}'...")
        # 我们直接使用 save_trip_to_db 函数
        inserted_id = await save_trip_to_db(sample_trip_data)
        if inserted_id:
            print(f"✅ 数据插入成功！MongoDB 文档 _id: {inserted_id}")
        else:
            print("❌ 数据插入失败。")

if __name__ == "__main__":
    # 运行异步的 main 函数
    asyncio.run(main())