import requests
import json

# 基本参数配置
apiUrl = 'https://apis.juhe.cn/flight/query'  # 接口请求URL
apiKey = '27799488ec98229b6bbddcd03d474e54'  # 在个人中心->我的数据,接口名称上方查看

# 接口请求入参配置（使用IATA代码）
requestParams = {
    'key': apiKey,  # API密钥
    'departure': 'PEK',  # 北京首都机场的IATA代码
    'arrival': 'SHA',  # 上海虹桥机场的IATA代码
    'departureDate': '2025-08-25',  # 出发日期，格式：YYYY-MM-DD
    'flightNo': '',  # 航班号，留空表示查询所有航班
    'maxSegments': '1',  # 最多航段数，留空表示不限制
}

# 发起接口网络请求
response = requests.get(apiUrl, params=requestParams)

# 解析响应结果
if response.status_code == 200:
    responseResult = response.json()
    print("API响应结果：", json.dumps(responseResult, ensure_ascii=False, indent=2))  # 打印整个响应
    # 网络请求成功。根据业务逻辑和接口文档说明处理响应数据。
    if 'error_code' in responseResult and responseResult['error_code'] == 0:  # 判断返回状态码
        print("航班信息查询成功！")
        print("查询结果：", responseResult['result'])  # 输出航班信息
    else:
        print(f"查询失败，错误信息：{responseResult.get('reason', '未知错误')}")
else:
    # 网络异常等因素，解析结果异常。可依据业务逻辑自行处理。
    print(f"请求异常，HTTP状态码：{response.status_code}")
