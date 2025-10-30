import json
from . import LLMResponse, LLMState


def json_parser(ori_response: str, oxy_request=None) -> LLMResponse:
    """
    JSON解析器，处理LLM响应
    Args:
        ori_response: 原始响应字符串
        oxy_request: Oxy请求对象（可选）
    """
    # 如果 ori_response 是空的或无效，直接返回错误
    if not ori_response or ori_response.strip() == "":
        return LLMResponse(
            state=LLMState.ERROR_PARSE,
            output="Empty response received",
            ori_response=ori_response
        )

    try:
        # 清理响应字符串，移除可能的标记
        cleaned_response = ori_response.strip()

        # 尝试解析JSON
        data = json.loads(cleaned_response)

        # 只有当 data 是 dict 且存在非空 tool_name 才触发工具调用
        if isinstance(data, dict) and data.get("tool_name"):
            return LLMResponse(
                state=LLMState.TOOL_CALL,
                output=data,
                ori_response=ori_response
            )

        # 其他 JSON（包括数组或普通对象）一律当作回答文本返回
        return LLMResponse(
            state=LLMState.ANSWER,
            output=data,
            ori_response=ori_response
        )

    except json.JSONDecodeError as e:
        # 构建详细的错误信息
        error_msg = f"Invalid JSON: {e}"

        # 如果有请求上下文，添加请求ID便于调试
        if oxy_request and hasattr(oxy_request, 'request_id'):
            error_msg += f" (Request ID: {oxy_request.request_id})"

        return LLMResponse(
            state=LLMState.ERROR_PARSE,
            output=error_msg,
            ori_response=ori_response
        )