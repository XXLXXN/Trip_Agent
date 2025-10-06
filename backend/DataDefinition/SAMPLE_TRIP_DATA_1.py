from datetime import date, time

SAMPLE_TRIP_DATA_1 = {
  "trip_id": "beijing_shanghai_trip_001",
  "trip_name": "北京到上海三日游",
  "origin": "北京",
  "destination": "上海",
  "start_date": "2025-11-15",
  "end_date": "2025-11-17",
  "days": [
    {
      "date": "2025-11-15",
      "day_of_week": "星期六",
      "day_index": 1,
      "total_cost": 2100,
      "activities": [
        {
          "id": "transport_1",
          "type": "transportation",
          "mode": "plane",
          "start_time": "08:30",
          "end_time": "11:00",
          "origin": {
            "name": "北京首都国际机场 (PEK)",
            "address": "中国北京市顺义区机场南路",
            "coordinates":None
          },
          "destination": {
            "name": "上海浦东国际机场 (PVG)",
            "address": "中国上海市浦东新区迎宾大道",
            "coordinates": None
          },
          "description": "乘坐东方航空MU5179航班，从北京飞往上海。",
          "notes": "请提前2小时到达机场办理登机手续，并预留时间通过安检。",
          "cost": 1200,
          "ticket_info": {
            "price": 1200,
            "url": "https://example.com/mu5179-ticket",
            "description": "东方航空 MU5179 航班电子票"
          }
        },
        {
          "id": "transport_2",
          "type": "transportation",
          "mode": "maglev_train",
          "start_time": "11:45",
          "end_time": "12:15",
          "origin": {
            "name": "上海浦东国际机场 (PVG)",
            "address": "中国上海市浦东新区迎宾大道"
          },
          "destination": {
            "name": "龙阳路地铁站",
            "address": "中国上海市浦东新区龙阳路"
          },
          "description": "乘坐上海磁悬浮列车，从浦东机场快速前往市区。",
          "notes": "磁悬浮列车速度极快，注意站稳扶好。",
          "cost": 50,
          "ticket_info": {
            "price": 50,
            "url": None,
            "description": "磁悬浮单程票"
          }
        },
        {
          "id": "activity_1",
          "type": "activity",
          "start_time": "13:30",
          "end_time": "15:00",
          "title": "办理酒店入住",
          "location": {
            "name": "上海大酒店",
            "address": "中国上海市黄浦区浙江中路",
            "coordinates": {
              "latitude": 31.2334,
              "longitude": 121.4746
            }
          },
          "description": "抵达酒店办理入住，稍作休息，为下午的行程做准备。",
          "notes": "入住时请出示所有住客的身份证件。",
          "cost": 0,
          "recommended_products": []
        },
        {
          "id": "activity_2",
          "type": "activity",
          "start_time": "15:30",
          "end_time": "18:00",
          "title": "游览南京路步行街",
          "location": {
            "name": "南京路步行街",
            "address": "中国上海市黄浦区南京路",
            "coordinates": {
              "latitude": 31.2333,
              "longitude": 121.4721
            }
          },
          "description": "在南京路步行街购物和观光，感受上海的繁华都市氛围。",
          "notes": "人流较大，注意保管好个人财物。",
          "cost": 0,
          "recommended_products": []
        },
        {
          "id": "activity_3",
          "type": "activity",
          "start_time": "18:30",
          "end_time": "20:00",
          "title": "晚餐：小笼包品尝",
          "location": {
            "name": "南翔馒头店",
            "address": "中国上海市黄浦区豫园路85号",
            "coordinates": {
              "latitude": 31.2291,
              "longitude": 121.4920
            }
          },
          "description": "品尝上海地道的小笼包，体验本地风味。",
          "notes": "可能需要排队，建议错峰用餐。",
          "cost": 80,
          "recommended_products": []
        }
      ]
    },
    {
      "date": "2025-11-16",
      "day_of_week": "星期日",
      "day_index": 2,
      "total_cost": 500,
      "activities": [
        {
          "id": "activity_4",
          "type": "activity",
          "start_time": "10:00",
          "end_time": "12:00",
          "title": "参观豫园",
          "location": {
            "name": "豫园",
            "address": "中国上海市黄浦区安仁街218号",
            "coordinates": {
              "latitude": 31.2274,
              "longitude": 121.4927
            }
          },
          "description": "游览古典园林，感受江南园林的精致。",
          "notes": "豫园门票可在现场购买，园内有很多传统小吃和纪念品店。",
          "cost": 40,
          "recommended_products": [
            {
              "name": "豫园门票",
              "price": 40,
              "description": "豫园成人门票",
              "url": "https://example.com/yuyuan-ticket"
            }
          ]
        },
        {
          "id": "transport_3",
          "type": "transportation",
          "mode": "subway",
          "start_time": "12:30",
          "end_time": "13:00",
          "origin": {
            "name": "豫园地铁站",
            "address": "中国上海市黄浦区人民路"
          },
          "destination": {
            "name": "陆家嘴地铁站",
            "address": "中国上海市浦东新区陆家嘴环路"
          },
          "description": "乘坐上海地铁10号线，转2号线，前往陆家嘴。",
          "notes": "使用上海交通卡或手机支付会更便捷。",
          "cost": 4,
          "ticket_info": None
        },
        {
          "id": "activity_5",
          "type": "activity",
          "start_time": "13:00",
          "end_time": "14:00",
          "title": "午餐：陆家嘴简餐",
          "location": {
            "name": "国金中心商场",
            "address": "中国上海市浦东新区世纪大道8号"
          },
          "description": "在国金中心商场内用餐，选择多样。",
          "notes": None,
          "cost": 100,
          "recommended_products": []
        },
        {
          "id": "activity_6",
          "type": "activity",
          "start_time": "14:30",
          "end_time": "17:00",
          "title": "登上东方明珠",
          "location": {
            "name": "东方明珠广播电视塔",
            "address": "中国上海市浦东新区世纪大道1号",
            "coordinates": {
              "latitude": 31.2397,
              "longitude": 121.4998
            }
          },
          "description": "从高空俯瞰上海全景，观赏黄浦江两岸的壮丽景色。",
          "notes": "建议提前网上购票，以免排队时间过长。",
          "cost": 220,
          "recommended_products": [
            {
              "name": "东方明珠A票",
              "price": 220,
              "description": "东方明珠塔的A票，可游览上中下球体。",
              "url": "https://example.com/oriental-pearl-ticket"
            }
          ]
        }
      ]
    },
    {
      "date": "2025-11-17",
      "day_of_week": "星期一",
      "day_index": 3,
      "total_cost": 0,
      "activities": [
        {
          "id": "activity_7",
          "type": "activity",
          "start_time": "09:00",
          "end_time": "10:00",
          "title": "酒店退房",
          "location": {
            "name": "上海大酒店",
            "address": "中国上海市黄浦区浙江中路",
            "coordinates": None
          },
          "description": "在酒店办理退房手续。",
          "notes": "请确保没有遗漏个人物品。",
          "cost": 0
        },
        {
          "id": "transport_4",
          "type": "transportation",
          "mode": "subway",
          "start_time": "10:30",
          "end_time": "11:30",
          "origin": {
            "name": "人民广场地铁站",
            "address": "中国上海市黄浦区人民广场"
          },
          "destination": {
            "name": "上海虹桥国际机场 (SHA)",
            "address": "中国上海市长宁区虹桥路"
          },
          "description": "乘坐上海地铁2号线，从人民广场前往虹桥国际机场。",
          "notes": "地铁站到航站楼步行距离较长，请预留足够时间。",
          "cost": 5
        },
        {
          "id": "transport_5",
          "type": "transportation",
          "mode": "plane",
          "start_time": "13:30",
          "end_time": "16:00",
          "origin": {
            "name": "上海虹桥国际机场 (SHA)",
            "address": "中国上海市长宁区虹桥路",
            "coordinates": None
          },
          "destination": {
            "name": "北京首都国际机场 (PEK)",
            "address": "中国北京市顺义区机场南路",
            "coordinates": None
          },
          "description": "乘坐国航CA1832航班，从上海返回北京。",
          "notes": "回程航班，请再次检查行李。",
          "cost": 900,
          "ticket_info": {
            "price": 900,
            "url": "https://example.com/ca1832-ticket",
            "description": "国航 CA1832 航班电子票"
          }
        }
      ]
    }
  ]
}


