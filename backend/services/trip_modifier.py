import json
import os
import tempfile
import time
from typing import Any, Dict, Tuple
import httpx

from tools.connect_location2 import connect_location2

# modify_agent 服务地址
MODIFY_AGENT_URL = "http://127.0.0.1:8085/chat"


def _generate_detailed_trip(raw_trip: Dict[str, Any]) -> Dict[str, Any]:
    """调用 connect_location2 生成新的 detailed_trip。"""
    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8") as temp_file:
            json.dump(raw_trip, temp_file, ensure_ascii=False)
            temp_file_path = temp_file.name

        detailed_trip = connect_location2(temp_file_path)
        if not detailed_trip:
            raise ValueError("connect_location2 生成 detailed_trip 失败")
        return detailed_trip
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)


def _call_modify_agent(raw_trip: Dict[str, Any], user_request: str) -> Tuple[Dict[str, Any], str]:
    """调用 modify_agent API 来处理行程修改请求。

    返回 (update_data, raw_response_text)。
    update_data 是扁平化的字典（用于 $set），raw_response_text 用于调试保存。
    """
    start_ts = time.time()
    raw_response_text = ""
    try:
        full_query = f"""
这是当前的行程JSON数据：
```json
{json.dumps(raw_trip, ensure_ascii=False, indent=2)}
```

用户修改请求：{user_request}

请按照你的提示词要求，分析并生成 update_data 字典。
"""

        print(f"[modify_agent] 调用 modify_agent API")
        print(f"[modify_agent] User request: {user_request}")

        with httpx.Client(timeout=120.0) as client:
            response = client.post(MODIFY_AGENT_URL, json={"query": full_query})
            response.raise_for_status()

            try:
                result = response.json()
            except Exception:
                raw_response_text = response.text
                result = {}

            if not raw_response_text:
                raw_response_text = response.text

            # 如果返回为 dict，直接当作 update_data
            if isinstance(result, dict) and len(result) > 0:
                return result, raw_response_text

            # 否则尝试从文本中提取 JSON
            response_text = raw_response_text
            if response_text and ("{" in response_text):
                start_idx = response_text.find("{")
                end_idx = response_text.rfind("}") + 1
                if start_idx != -1 and end_idx > start_idx:
                    json_str = response_text[start_idx:end_idx]
                    update_data = json.loads(json_str)
                    return update_data, raw_response_text
                else:
                    raise ValueError("无法从响应中提取 JSON 数据")

            raise ValueError("modify_agent 响应格式异常")
    except httpx.HTTPError as e:
        raise ValueError(f"调用 modify_agent 失败: {e}")
    except json.JSONDecodeError as e:
        raise ValueError(f"解析 modify_agent 响应失败: {e}")
    finally:
        duration = time.time() - start_ts
        print(f"[modify_agent] 调用耗时: {duration:.2f}s")


def _apply_update_data_to_mongodb(collection, trip_id: str, update_data: Dict[str, Any]) -> None:
    """将扁平化的 update_data 应用到 MongoDB。"""
    if not update_data:
        return

    mongo_update = {}
    for key, value in update_data.items():
        prefixed_key = f"raw_trip.{key}"
        mongo_update[prefixed_key] = value

    collection.update_one({"trip_id": trip_id}, {"$set": mongo_update})


def modify_and_regenerate_trip(collection, trip_id: str, new_activity: Dict[str, Any]) -> Dict[str, Any]:
    """使用 modify_agent 更新 raw_trip，并基于 connect_location2 生成新的 detailed_trip。"""
    if not trip_id:
        raise ValueError("trip_id 不能为空")
    if not isinstance(new_activity, dict):
        raise ValueError("new_activity 必须是对象")

    user_request = new_activity.get("user_request", "")

    trip_document = collection.find_one({"trip_id": trip_id})
    if not trip_document:
        raise ValueError(f"未找到 trip_id 为 {trip_id} 的行程")

    raw_trip = trip_document.get("raw_trip")
    if not raw_trip:
        raise ValueError(f"trip_id {trip_id} 缺少 raw_trip 数据")

    update_data, raw_response = _call_modify_agent(raw_trip, user_request)

    # 保存 debug 信息
    try:
        collection.update_one({"trip_id": trip_id}, {"$set": {"debug.last_modify_agent_response": raw_response}})
    except Exception:
        pass

    _apply_update_data_to_mongodb(collection, trip_id, update_data)

    updated_trip_document = collection.find_one({"trip_id": trip_id})
    updated_raw_trip = updated_trip_document.get("raw_trip")

    updated_detailed_trip = _generate_detailed_trip(updated_raw_trip)

    collection.update_one({"trip_id": trip_id}, {"$set": {"detailed_trip": updated_detailed_trip}})

    return updated_detailed_trip
import json
import os
import tempfile
import time
from typing import Any, Dict, Tuple
import httpx

from tools.connect_location2 import connect_location2

# modify_agent 服务地址
MODIFY_AGENT_URL = "http://127.0.0.1:8085/chat"


def _generate_detailed_trip(raw_trip: Dict[str, Any]) -> Dict[str, Any]:
    """调用 connect_location2 生成新的 detailed_trip。"""
    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8") as temp_file:
            json.dump(raw_trip, temp_file, ensure_ascii=False)
            temp_file_path = temp_file.name

        detailed_trip = connect_location2(temp_file_path)
        if not detailed_trip:
            raise ValueError("connect_location2 生成 detailed_trip 失败")
        return detailed_trip
 
        print(f"[modify_agent] User request: {user_request}")
        
        # 调用 modify_agent API
        with httpx.Client(timeout=60.0) as client:
            response = client.post(
                MODIFY_AGENT_URL,
                json={"query": full_query}
            )
            response.raise_for_status()
            
            result = response.json()
            print(f"[modify_agent] API 响应: {json.dumps(result, ensure_ascii=False)[:500]}...")
            # modify_agent 可能直接返回扁平化的 update_data 字典，
            # 或者返回包含 response 字段的文本。
            # 优先处理直接返回字典的情况。
            if isinstance(result, dict) and len(result) > 0:
                print(f"[modify_agent] 返回的是字典 update_data，字段数: {len(result)}")
                return result

            # 如果返回的是字符串包装在 response 字段中，尝试解析
            response_text = ""
            if isinstance(result, dict) and "response" in result:
                response_text = result.get("response", "")
            elif isinstance(result, str):
                response_text = result

            # 尝试从响应中提取 JSON 格式的 update_data
            if response_text and ("{" in response_text):
                import json
                import os
                import tempfile
                import time
                from typing import Any, Dict, Tuple
                import httpx

                from tools.connect_location2 import connect_location2

                # modify_agent 服务地址
                MODIFY_AGENT_URL = "http://127.0.0.1:8085/chat"


                def _generate_detailed_trip(raw_trip: Dict[str, Any]) -> Dict[str, Any]:
                    """调用 connect_location2 生成新的 detailed_trip。"""
                    temp_file_path = None
                    try:
                        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8") as temp_file:
                            json.dump(raw_trip, temp_file, ensure_ascii=False)
                            temp_file_path = temp_file.name

                        detailed_trip = connect_location2(temp_file_path)
                        if not detailed_trip:
                            raise ValueError("connect_location2 生成 detailed_trip 失败")
                        return detailed_trip
                    finally:
                        if temp_file_path and os.path.exists(temp_file_path):
                            os.remove(temp_file_path)


                def _call_modify_agent(raw_trip: Dict[str, Any], user_request: str) -> Tuple[Dict[str, Any], str]:
                    """调用 modify_agent API 来处理行程修改请求。

                    返回 (update_data, raw_response_text)。
                    update_data 是扁平化的字典（用于 $set），raw_response_text 用于调试保存。
                    """
                    start_ts = time.time()
                    raw_response_text = ""
                    try:
                        full_query = f"""
                这是当前的行程JSON数据：
                ```json
                {json.dumps(raw_trip, ensure_ascii=False, indent=2)}
                ```

                用户修改请求：{user_request}

                请按照你的提示词要求，分析并生成 update_data 字典。
                """

                        print(f"[modify_agent] 调用 modify_agent API")
                        print(f"[modify_agent] User request: {user_request}")

                        # 增加超时时间以应对复杂推理
                        with httpx.Client(timeout=120.0) as client:
                            response = client.post(MODIFY_AGENT_URL, json={"query": full_query})
                            response.raise_for_status()

                            # 尝试解析 JSON，否则保留文本
                            try:
                                result = response.json()
                            except Exception:
                                raw_response_text = response.text
                                result = {}

                            if not raw_response_text:
                                raw_response_text = response.text

                            print(f"[modify_agent] API 响应（raw）: {raw_response_text[:1000]}...")

                            # 如果返回为 dict，直接当作 update_data
                            if isinstance(result, dict) and len(result) > 0:
                                print(f"[modify_agent] 返回的是字典 update_data，字段数: {len(result)}")
                                return result, raw_response_text

                            # 否则尝试从文本中提取 JSON
                            response_text = raw_response_text
                            if response_text and ("{" in response_text):
                                start_idx = response_text.find("{")
                                end_idx = response_text.rfind("}") + 1
                                if start_idx != -1 and end_idx > start_idx:
                                    json_str = response_text[start_idx:end_idx]
                                    update_data = json.loads(json_str)
                                    print(f"[modify_agent] 成功解析 update_data: {json.dumps(update_data, ensure_ascii=False)}")
                                    return update_data, raw_response_text
                                else:
                                    raise ValueError("无法从响应中提取 JSON 数据")

                            raise ValueError(f"modify_agent 响应格式异常: {raw_response_text[:200]}")
                    except httpx.HTTPError as e:
                        print(f"[modify_agent] HTTP 错误: {e}")
                        raise ValueError(f"调用 modify_agent 失败: {e}")
                    except json.JSONDecodeError as e:
                        print(f"[modify_agent] JSON 解析错误: {e}")
                        raise ValueError(f"解析 modify_agent 响应失败: {e}")
                    except Exception as e:
                        print(f"[modify_agent] 未知错误: {e}")
                        raise ValueError(f"处理 modify_agent 响应时出错: {e}")
                    finally:
                        duration = time.time() - start_ts
                        print(f"[modify_agent] 调用耗时: {duration:.2f}s")


                def _apply_update_data_to_mongodb(collection, trip_id: str, update_data: Dict[str, Any]) -> None:
                    """将扁平化的 update_data 应用到 MongoDB。"""
                    if not update_data:
                        print("[apply_update] update_data 为空，跳过更新")
                        return

                    mongo_update = {}
                    for key, value in update_data.items():
                        prefixed_key = f"raw_trip.{key}"
                        mongo_update[prefixed_key] = value

                    print(f"[apply_update] 准备更新 MongoDB，字段数: {len(mongo_update)}")

                    update_result = collection.update_one({"trip_id": trip_id}, {"$set": mongo_update})

                    if update_result.modified_count == 0:
                        print(f"[apply_update] 警告: trip_id {trip_id} 在 MongoDB 中没有产生修改")
                    else:
                        print(f"[apply_update] 成功更新了 {update_result.modified_count} 个文档")


                def modify_and_regenerate_trip(collection, trip_id: str, new_activity: Dict[str, Any]) -> Dict[str, Any]:
                    """使用 modify_agent 更新 raw_trip，并基于 connect_location2 生成新的 detailed_trip。

                    Args:
                        collection: MongoDB 集合
                        trip_id: 行程 ID
                        new_activity: 包含用户修改请求的字典，应包含 "user_request" 字段
                    """
                    if not trip_id:
                        raise ValueError("trip_id 不能为空")
                    if not isinstance(new_activity, dict):
                        raise ValueError("new_activity 必须是对象")

                    user_request = new_activity.get("user_request", "将 activity_6 改成希尔顿酒店")

                    print(f"[modify] 开始处理 trip_id: {trip_id}")
                    print(f"[modify] 用户请求: {user_request}")

                    trip_document = collection.find_one({"trip_id": trip_id})
                    if not trip_document:
                        raise ValueError(f"未找到 trip_id 为 {trip_id} 的行程")

                    raw_trip = trip_document.get("raw_trip")
                    if not raw_trip:
                        raise ValueError(f"trip_id {trip_id} 缺少 raw_trip 数据")

                    print("[modify] 已获取原始 raw_trip 数据")

                    # 调用 modify_agent
                    start_ts = time.time()
                    try:
                        update_data, raw_response = _call_modify_agent(raw_trip, user_request)
                        duration = time.time() - start_ts
                        print(f"[modify] modify_agent 返回了 {len(update_data)} 个更新字段")
                    except Exception as e:
                        print(f"[modify] 调用 modify_agent 失败: {e}")
                        raise ValueError(f"无法使用 AI 处理修改请求: {e}")

                    # 保存原始 LLM 响应以便调试
                    try:
                        collection.update_one({"trip_id": trip_id}, {"$set": {"debug.last_modify_agent_response": raw_response, "debug.last_modify_agent_duration": duration}})
                    except Exception as e:
                        print(f"[modify] 无法保存 debug 信息: {e}")

                    # 应用更新到 raw_trip
                    _apply_update_data_to_mongodb(collection, trip_id, update_data)
                    print("[modify] raw_trip 已更新到数据库")

                    # 重新获取更新后的 raw_trip
                    updated_trip_document = collection.find_one({"trip_id": trip_id})
                    updated_raw_trip = updated_trip_document.get("raw_trip")

                    # 生成新的 detailed_trip
                    print("[modify] 开始生成 detailed_trip...")
                    updated_detailed_trip = _generate_detailed_trip(updated_raw_trip)
                    print("[modify] detailed_trip 已重新生成")

                    # 更新 detailed_trip 到数据库
                    collection.update_one({"trip_id": trip_id}, {"$set": {"detailed_trip": updated_detailed_trip}})
                    print("[modify] detailed_trip 已更新到数据库")

                    return updated_detailed_trip

