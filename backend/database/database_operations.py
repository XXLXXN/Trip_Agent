# database_operations.py

import json
import motor.motor_asyncio
import asyncio
import sys
import os
from bson.json_util import dumps  # 导入 dumps 用于美化输出 MongoDB 文档
from bson.objectid import ObjectId  # 导入 ObjectId 用于按 _id 查询
from bson.errors import InvalidId  # 导入 InvalidId 用于处理无效的ID格式

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# --- 数据库配置 (Database Configuration) ---
# **请确保这是您最新的、正确的连接配置**
# 配合 Port Forwarding 时的配置：
MONGO_URI = "mongodb://root:xfkswrm6@dbconn.sealoshzh.site:33420/?directConnection=true"
# 如果您使用的是外部IP，请自行替换上面的 MONGO_URI

DATABASE_NAME = "itinerary_db"
COLLECTION_NAME = "trips"

# --- 数据库客户端设置 (Database Client Setup) ---
try:
    db_client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
    db = db_client[DATABASE_NAME]
    trip_collection = db[COLLECTION_NAME]
    print("成功连接到 MongoDB。")
except Exception as e:
    print(f"连接 MongoDB 时出错: {e}")
    db_client = None
    trip_collection = None


# --- CRUD 函数 ---

# 增 (Create)
async def save_trip_to_db(trip_data: dict) -> str | None:
    """
    将旅行行程文档保存到 MongoDB 集合中。
    """
    if trip_collection is None:
        print("数据库集合不可用。无法保存行程。")
        return None

    try:
        # 核心操作：将字典插入到集合中。
        result = await trip_collection.insert_one(trip_data)

        if result.acknowledged:
            inserted_id = str(result.inserted_id)
            print(f"成功插入行程。文档 ID: {inserted_id}")
            return inserted_id
        else:
            print("数据库未确认插入操作。")
            return None

    except Exception as e:
        print(f"向 MongoDB 插入数据时发生错误: {e}")
        return None


# 查 (Read - All)
async def fetch_all_trips():
    """
    从集合中检索所有旅行行程文档，并打印它们。
    """
    if trip_collection is None:
        print("数据库集合不可用。无法获取行程数据。")
        return []

    print("\n--- 正在从数据库中获取所有行程数据 ---")
    try:
        # 使用 find() 查找所有文档，并通过 to_list() 将异步游标转换为列表
        cursor = trip_collection.find({})
        trips = await cursor.to_list(length=None)  # length=None 表示获取所有结果

        if not trips:
            print("集合中没有找到任何行程数据。")
            return []

        print(f"✅ 成功找到 {len(trips)} 个行程文档:")

        # 遍历结果并打印，使用 dumps() 格式化输出，便于阅读
        for i, trip in enumerate(trips, 1):
            # dumps() 将 BSON 对象（如 ObjectId）转换为可读的 JSON 字符串
            print(f"\n--- 文档 #{i} ---")
            print(dumps(trip, indent=4, ensure_ascii=False))

        return trips

    except Exception as e:
        print(f"从 MongoDB 查询数据时发生错误: {e}")
        return []


# 查 (Read - One by ID)
async def fetch_trip_by_id(trip_id: str) -> dict | None:
    """
    根据提供的 _id 从集合中检索单个行程文档。
    """
    if trip_collection is None:
        print("数据库集合不可用。无法获取行程数据。")
        return None

    try:
        # MongoDB 的 _id 是 ObjectId 类型，需要将字符串 ID 转换
        object_id = ObjectId(trip_id)

        # 使用 find_one() 查找匹配的单个文档
        trip = await trip_collection.find_one({"_id": object_id})

        if trip:
            print(f"✅ 成功找到 ID 为 {trip_id} 的行程。")
            # 为了便于调试，我们也可以在这里打印找到的文档
            # print(dumps(trip, indent=4, ensure_ascii=False))
        else:
            print(f"未找到 ID 为 {trip_id} 的行程。")

        return trip

    except InvalidId:
        print(f"错误: 提供的 ID '{trip_id}' 不是有效的 MongoDB ObjectId 格式。")
        return None
    except Exception as e:
        print(f"根据 ID '{trip_id}' 查询数据时发生错误: {e}")
        return None


# 改 (Update)
async def update_trip_by_id(trip_id: str, update_data: dict) -> bool:
    """
    根据 _id 更新一个行程文档。
    """
    if trip_collection is None:
        print("数据库集合不可用。无法更新行程。")
        return False

    try:
        object_id = ObjectId(trip_id)

        # 使用 $set 操作符更新指定字段，而不是替换整个文档
        result = await trip_collection.update_one(
            {"_id": object_id},
            {"$set": update_data}
        )

        if result.modified_count > 0:
            print(f"✅ 成功更新 ID 为 {trip_id} 的文档。")
            return True
        elif result.matched_count > 0:
            print(f"找到了 ID 为 {trip_id} 的文档，但提供的数据与现有数据相同，未进行修改。")
            return True
        else:
            print(f"未找到 ID 为 {trip_id} 的文档，无法更新。")
            return False

    except InvalidId:
        print(f"错误: 提供的 ID '{trip_id}' 不是有效的 MongoDB ObjectId 格式。")
        return False
    except Exception as e:
        print(f"更新 ID 为 '{trip_id}' 的数据时发生错误: {e}")
        return False


# 删 (Delete)
async def delete_trip_by_id(trip_id: str) -> bool:
    """
    根据 _id 删除一个行程文档。
    """
    if trip_collection is None:
        print("数据库集合不可用。无法删除行程。")
        return False

    try:
        object_id = ObjectId(trip_id)

        # 使用 delete_one() 删除匹配的单个文档
        result = await trip_collection.delete_one({"_id": object_id})

        if result.deleted_count > 0:
            print(f"✅ 成功删除 ID 为 {trip_id} 的文档。")
            return True
        else:
            print(f"未找到 ID 为 {trip_id} 的文档，无法删除。")
            return False

    except InvalidId:
        print(f"错误: 提供的 ID '{trip_id}' 不是有效的 MongoDB ObjectId 格式。")
        return False
    except Exception as e:
        print(f"删除 ID 为 '{trip_id}' 的数据时发生错误: {e}")
        return False


# 确保 SAMPLE_TRIP_DATA_1 文件和路径是正确的
# 使用动态路径解析导入
import importlib.util
import os

# 获取当前文件的绝对路径
current_dir = os.path.dirname(os.path.abspath(__file__))
# 构建 SAMPLE_TRIP_DATA_1 文件的路径
sample_data_path = os.path.join(current_dir, '..', 'DataDefinition', 'SAMPLE_TRIP_DATA_1.py')

# 动态导入模块
spec = importlib.util.spec_from_file_location("SAMPLE_TRIP_DATA_1", sample_data_path)
sample_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sample_module)
SAMPLE_TRIP_DATA_1 = sample_module.SAMPLE_TRIP_DATA_1


async def main():
    """
    主入口点，用于演示和调试完整的 CRUD 流程。
    """
    print("--- 运行行程存储与检索调试脚本 (完整 CRUD) ---")

    # 用于存储我们新创建的文档ID
    new_trip_id = None

    # 1. 增 (Create)
    print("\n--- 1. 测试创建 (Create) ---")
    print(f"正在尝试保存行程: '{SAMPLE_TRIP_DATA_1.get('trip_name')}'")
    new_trip_id = await save_trip_to_db(SAMPLE_TRIP_DATA_1)

    if not new_trip_id:
        print("\n❌ 创建失败。脚本无法继续。请检查数据库连接和错误日志。")
        return  # 如果创建失败，后续操作无意义，直接退出

    print(f"\n✅ 创建成功！行程已保存，MongoDB _id: {new_trip_id}")

    # 2. 查 (Read - One)
    print("\n--- 2. 测试按 ID 查询 (Read One) ---")
    retrieved_trip = await fetch_trip_by_id(new_trip_id)
    if retrieved_trip:
        print("查询到的行程数据:")
        print(dumps(retrieved_trip, indent=4, ensure_ascii=False))

    # 3. 改 (Update)
    print("\n--- 3. 测试更新 (Update) ---")
    update_payload = {
        "trip_name": "【已更新】东京深度文化与美食探索之旅",
        "notes": "这是一个通过脚本更新后添加的备注。"
    }
    print(f"正在尝试将行程名称更新为: '{update_payload['trip_name']}'")
    update_success = await update_trip_by_id(new_trip_id, update_payload)

    if update_success:
        print("\n--- 3a. 再次查询以验证更新 ---")
        updated_trip = await fetch_trip_by_id(new_trip_id)
        if updated_trip:
            print("更新后的行程数据:")
            print(dumps(updated_trip, indent=4, ensure_ascii=False))

    # 4. 查 (Read - All)
    print("\n--- 4. 测试查询所有 (Read All) ---")
    await fetch_all_trips()

    # 5. 删 (Delete)
    print(f"\n--- 5. 测试删除 (Delete) ---")
    print(f"正在尝试删除 ID 为 {new_trip_id} 的行程...")
    delete_success = await delete_trip_by_id(new_trip_id)

    if delete_success:
        print("\n--- 5a. 再次查询以验证删除 ---")
        deleted_trip = await fetch_trip_by_id(new_trip_id)
        if not deleted_trip:
            print(f"✅ 验证成功：ID 为 {new_trip_id} 的行程已不存在。")

        print("\n--- 5b. 再次查询所有，确认文档已消失 ---")
        await fetch_all_trips()

    print("\n--- 调试脚本执行完毕 ---")


if __name__ == "__main__":
    # 在运行此脚本之前，请确保您的 MongoDB 服务（或 Port Forwarding）正在运行。
    # 并且，如果您使用的是 Port Forwarding，请保持其命令行窗口开启。
    asyncio.run(main())
