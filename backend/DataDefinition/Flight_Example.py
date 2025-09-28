
Example=[
  {
    "fcategory": "0",  # 航班类别（如国内/国际），"0" 通常表示国内航班
    "fservice": "J",  # 航班服务类型代码
    "ftype": "32A",  # 飞机机型，如 A320 系列
    "org_timezone": "28800",  # 始发地时区偏移量（秒），28800 秒即 UTC+8
    "dst_timezone": "28800",  # 目的地时区偏移量（秒），28800 秒即 UTC+8
    "FlightNo": "HO1854",  # 航班号
    "FlightCompany": "上海吉祥航空股份有限公司",  # 航空公司名称
    "FlightDepcode": "CAN",  # 出发机场三字码（广州白云）
    "FlightArrcode": "SHA",  # 到达机场三字码（上海虹桥）
    "AircraftNumber": "",  # 飞机注册号/机号
    "FlightDeptimePlanDate": "2025-10-14 06:40:00",  # 计划起飞时间
    "FlightArrtimePlanDate": "2025-10-14 09:05:00",  # 计划到达时间
    "FlightDeptimeReadyDate": "",  # 预计起飞时间（ETD）
    "FlightArrtimeReadyDate": "",  # 预计到达时间（ETA）
    "FlightDeptimeDate": "",  # 实际起飞时间
    "FlightArrtimeDate": "",  # 实际到达时间
    "FlightIngateTime": "",  # 飞机进港停机位时间
    "FlightOutgateTime": "",  # 飞机离港登机口时间
    "CheckinTable": "M18-M24",  # 值机柜台范围
    "CheckDoor": "12号门",  # 值机/安检入口信息
    "BoardGate": "",  # 登机口号
    "ReachExit": "",  # 到达出口信息
    "BaggageID": "",  # 行李转盘编号
    "BoardState": "",  # 登机状态
    "FlightState": "计划",  # 航班当前状态
    "FlightHTerminal": "T1",  # 航空公司主要运营航站楼
    "FlightTerminal": "T2",  # 实际出发航站楼
    "ShareFlightNo": "",  # 代码共享航班号
    "StopFlag": "",  # 经停标志（空表示直飞）
    "ShareFlag": "",  # 代码共享标志
    "ArrStandGate": "",  # 进港停机位
    "DepStandGate": "",  # 出港停机位
    "DelayReason": "",  # 延误原因
    "Food": "M",  # 餐饮服务代码，"M" 可能表示有餐食 (Meal)
    "EstimateBoardingStartTime": "",  # 预计开始登机时间
    "EstimateBoardingEndTime": "",  # 预计结束登机时间
    "FirstClassCheckinTable": "M17",  # 头等舱值机柜台
    "BusinessCheckinTable": "M17",  # 商务舱值机柜台
    "FlightDep": "广州",  # 出发城市名称
    "FlightArr": "上海",  # 到达城市名称
    "deptel": "020-86130217/86130240",  # 出发机场联系电话
    "arrtel": "021-22344553",  # 到达机场联系电话
    "airlinetel": "95520",  # 航空公司客服电话
    "bridge": "",  # 出发是否廊桥（空表示信息未定或非廊桥）
    "arr_bridge": "",  # 到达是否廊桥
    "FlightDepAirport": "广州白云",  # 出发机场全称
    "FlightArrAirport": "上海虹桥",  # 到达机场全称
    "LastCheckinTime": "",  # 最晚值机时间
    "OntimeRate": "90.00%",  # 历史起飞准点率
    "generic": "32A",  # 飞机机型通用代码
    "FlightYear": "",  # 航班年份信息
    "ArrOntimeRate": "96.67%",  # 历史到达准点率
    "DepWeather": "||||",  # 出发地天气信息（这里为空白数据）
    "ArrWeather": "||||",  # 目的地天气信息（这里为空白数据）
    "FlightDuration": "107",  # 预计飞行时长（分钟）
    "distance": "1308",  # 航线距离（公里）
    "FastestExitDuration": "",  # 最快离开出口时间
    "SlowestExitDuration": "",  # 最慢离开出口时间
    "FastestExitTime": "",  # 最快离开出口时刻
    "SlowestExitTime": "",  # 最慢离开出口时刻
    "VeryZhunReadyDeptimeDate": "2025-10-14 06:40:00",  # 某些平台预测的预计起飞时间
    "VeryZhunReadyArrtimeDate": "2025-10-14 08:27:00",  # 某些平台预测的预计到达时间
    "AssistFlightState": "计划",  # 辅助航班状态
    "DepAirportLat": "23.387861",  # 出发机场纬度
    "DepAirportLon": "113.29734",  # 出发机场经度
    "DepTerminalLat": "23.393169",  # 出发航站楼纬度
    "DepTerminalLon": "113.309858",  # 出发航站楼经度
    "ArrAirportLat": "31.19779",  # 到达机场纬度
    "ArrAirportLon": "121.33347",  # 到达机场经度
    "ArrTerminalLat": "31.200811",  # 到达航站楼纬度
    "ArrTerminalLon": "121.333905",  # 到达航站楼经度
    "FlightStateNum": 0,  # 航班状态数字代码，"0" 表示计划
    "StopAirportCode": "",  # 经停机场三字码
    "StopCity": ""  # 经停城市名称
  },
  {
    "fcategory": "0",  # 航班类别
    "fservice": "J",  # 航班服务类型代码
    "ftype": "A320",  # 飞机机型
    "org_timezone": "28800",  # 始发地时区偏移量
    "dst_timezone": "28800",  # 目的地时区偏移量
    "FlightNo": "9C8930",  # 航班号
    "FlightCompany": "春秋航空有限公司",  # 航空公司名称
    "FlightDepcode": "CAN",  # 出发机场三字码
    "FlightArrcode": "SHA",  # 到达机场三字码
    "AircraftNumber": "",  # 飞机注册号/机号
    "FlightDeptimePlanDate": "2025-10-14 06:45:00",  # 计划起飞时间
    "FlightArrtimePlanDate": "2025-10-14 09:10:00",  # 计划到达时间
    "FlightDeptimeReadyDate": "",  # 预计起飞时间（ETD）
    "FlightArrtimeReadyDate": "",  # 预计到达时间（ETA）
    "FlightDeptimeDate": "",  # 实际起飞时间
    "FlightArrtimeDate": "",  # 实际到达时间
    "FlightIngateTime": "",  # 飞机进港停机位时间
    "FlightOutgateTime": "",  # 飞机离港登机口时间
    "CheckinTable": "C06-C07",  # 值机柜台范围
    "CheckDoor": "3、6号门",  # 值机/安检入口信息
    "BoardGate": "",  # 登机口号
    "ReachExit": "",  # 到达出口信息
    "BaggageID": "",  # 行李转盘编号
    "BoardState": "",  # 登机状态
    "FlightState": "计划",  # 航班当前状态
    "FlightHTerminal": "T1",  # 航空公司主要运营航站楼
    "FlightTerminal": "T1",  # 实际出发航站楼
    "ShareFlightNo": "",  # 代码共享航班号
    "StopFlag": "",  # 经停标志
    "ShareFlag": "",  # 代码共享标志
    "ArrStandGate": "",  # 进港停机位
    "DepStandGate": "",  # 出港停机位
    "DelayReason": "",  # 延误原因
    "Food": "N",  # 餐饮服务代码，"N" 可能表示无餐食 (No Meal)
    "EstimateBoardingStartTime": "",  # 预计开始登机时间
    "EstimateBoardingEndTime": "",  # 预计结束登机时间
    "FirstClassCheckinTable": "",  # 头等舱值机柜台
    "BusinessCheckinTable": "",  # 商务舱值机柜台
    "FlightDep": "广州",  # 出发城市名称
    "FlightArr": "上海",  # 到达城市名称
    "deptel": "020-86130217/86130240",  # 出发机场联系电话
    "arrtel": "021-22344553",  # 到达机场联系电话
    "airlinetel": "95524",  # 航空公司客服电话
    "bridge": "",  # 出发是否廊桥
    "arr_bridge": "",  # 到达是否廊桥
    "FlightDepAirport": "广州白云",  # 出发机场全称
    "FlightArrAirport": "上海虹桥",  # 到达机场全称
    "LastCheckinTime": "",  # 最晚值机时间
    "OntimeRate": "80.00%",  # 历史起飞准点率
    "generic": "A320",  # 飞机机型通用代码
    "FlightYear": "",  # 航班年份信息
    "ArrOntimeRate": "96.67%",  # 历史到达准点率
    "DepWeather": "||||",  # 出发地天气信息
    "ArrWeather": "||||",  # 目的地天气信息
    "FlightDuration": "111",  # 预计飞行时长（分钟）
    "distance": "1308",  # 航线距离（公里）
    "FastestExitDuration": "",  # 最快离开出口时间
    "SlowestExitDuration": "",  # 最慢离开出口时间
    "FastestExitTime": "",  # 最快离开出口时刻
    "SlowestExitTime": "",  # 最慢离开出口时刻
    "VeryZhunReadyDeptimeDate": "2025-10-14 06:45:00",  # 某些平台预测的预计起飞时间
    "VeryZhunReadyArrtimeDate": "2025-10-14 08:36:00",  # 某些平台预测的预计到达时间
    "AssistFlightState": "计划",  # 辅助航班状态
    "DepAirportLat": "23.387861",  # 出发机场纬度
    "DepAirportLon": "113.29734",  # 出发机场经度
    "DepTerminalLat": "23.393169",  # 出发航站楼纬度
    "DepTerminalLon": "113.309858",  # 出发航站楼经度
    "ArrAirportLat": "31.19779",  # 到达机场纬度
    "ArrAirportLon": "121.33347",  # 到达机场经度
    "ArrTerminalLat": "31.20077",  # 到达航站楼纬度
    "ArrTerminalLon": "121.353102",  # 到达航站楼经度
    "FlightStateNum": 0,  # 航班状态数字代码
    "StopAirportCode": "",  # 经停机场三字码
    "StopCity": ""  # 经停城市名称
  }
]