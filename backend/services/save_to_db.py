

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

from datetime import date, time


# 模型定义...
from backend.DataDefinition.DataDefinition import Trip,Day,Activity,Location

# 数据库连接配置
# 请根据您的实际情况修改此处的连接字符串
DATABASE_URL = "jdbc:postgresql://localhost:5432/postgres"

# 创建一个数据库引擎，可以被多个函数复用

engine: Engine = create_engine(DATABASE_URL)

def save_to_db(validated_data: Trip):
    """
    将 Trip 数据保存到 PostgresSQL 数据库。

    Args:
        validated_data (Trip): 已经通过 Pydantic 验证的 Trip 对象。
    """
    # 将 Pydantic 对象转换为字典，然后序列化为 JSON 字符串
    # 确保使用 default=str 来处理 date 和 time 对象
    # to_json() 方法会更可靠，因为它会自动处理这些类型
    trip_data_json = validated_data.model_dump_json()

    # SQL 插入语句，使用参数化查询来防止 SQL 注入
    # 注意：这里我们使用 ON CONFLICT DO UPDATE 来实现 upsert (插入或更新)
    # 如果 id 已存在，则更新相关字段
    sql_statement = text("""
        INSERT INTO trips (
            id, user_id, trip_name, destination, start_date, end_date, data
        ) VALUES (
            :id, :user_id, :trip_name, :destination, :start_date, :end_date, :data::jsonb
        ) ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            trip_name = EXCLUDED.trip_name,
            destination = EXCLUDED.destination,
            start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date,
            data = EXCLUDED.data::jsonb,
            updated_at = CURRENT_TIMESTAMP;
    """)

    # 准备参数
    params = {
        "id": validated_data.trip_id,
        "user_id": validated_data.user_id,
        "trip_name": validated_data.trip_name,
        "destination": validated_data.destination,
        "start_date": validated_data.start_date,
        "end_date": validated_data.end_date,
        # JSON 数据需要作为字符串传入
        "data": trip_data_json
    }

    try:
        with engine.connect() as connection:
            with connection.begin():  # 使用事务来确保操作的原子性
                connection.execute(sql_statement, params)
        print(f"行程 '{validated_data.trip_name}' (ID: {validated_data.trip_id}) 已成功保存到数据库。")
    except Exception as e:
        print(f"保存行程到数据库时发生错误: {e}")
        # 在实际应用中，您可能需要更详细的错误处理和日志记录
        raise

# 示例用法
if __name__ == "__main__":
    # 创建一个示例 Trip 对象
    sample_trip = Trip(
        user_id="user_123",
        trip_id="trip_abc",
        trip_name="日本东京五日游",
        destination="东京",
        start_date=date(2025, 10, 1),
        end_date=date(2025, 10, 5),
        days=[
            Day(
                date=date(2025, 10, 1),
                day_of_week="星期三",
                day_index=1,
                activities=[
                    Activity(
                        id="act_1",
                        start_time=time(9, 0),
                        end_time=time(12, 0),
                        title="浅草寺参观",
                        location=Location(name="浅草寺", address="日本东京都台东区浅草2丁目3-1")
                    )
                ]
            )
        ]
    )

    # 调用保存函数
    save_to_db(sample_trip)