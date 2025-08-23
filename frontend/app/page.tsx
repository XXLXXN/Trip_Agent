'use client'

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Rating,
  Radio,
  RadioGroup,
  FormControlLabel as MuiFormControlLabel
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Flight as FlightIcon,
  Train as TrainIcon,
  DirectionsCar as CarIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  Attractions as AttractionsIcon,
  ArrowBack as ArrowBackIcon,
  Wifi as WifiIcon,
  LocalParking as ParkingIcon,
  Restaurant as RestaurantIcon2,
  Pool as PoolIcon,
  FitnessCenter as GymIcon
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";

// 类型定义
type TravellerType = "成人" | "儿童" | "老人" | "学生";
type BudgetPreference = "吃饭" | "住宿" | "玩乐";
type TransportationPreference = "飞机" | "火车" | "自驾";
type TripStyle = "文艺" | "美食" | "自然" | "人文" | "小众";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Location {
  name: string;
  address: string;
  coordinates?: Coordinates;
}

interface Budget {
  min: number;
  max: number;
}

interface TravellerCount {
  travellers: Record<TravellerType, number>;
}

interface CreateSpotsRequest {
  departure_city: string;
  destination_city: string;
  departure_date: string;
  return_date: string;
  trip_style: TripStyle;
}

// 酒店接口
interface Hotel {
  name: string;
  location: Location;
  price: number;
  rating: number;
  description: string;
  recommendation_reason: string;
  url?: string;
  amenities: string[];
}

interface HotelRecommendation {
  recommended_hotels: Hotel[];
}

interface CreateItineraryRequest {
  user_id: string;
  departure_city: string;
  destination_city: string;
  budget: Budget;
  departure_date: string;
  return_date: string;
  travellers_count: TravellerCount;
  transportation_preference: TransportationPreference;
  budget_preference: BudgetPreference[];
  trip_style: TripStyle;
  other_requirement: string;
  spots: Location[];
  selected_hotel?: Hotel; // 添加选中的酒店
}

// 常量定义
const TRAVELLER_TYPES: TravellerType[] = ["成人", "儿童", "老人", "学生"];
const BUDGET_PREFERENCES: BudgetPreference[] = ["吃饭", "住宿", "玩乐"];
const TRANSPORTATION_PREFERENCES: TransportationPreference[] = ["飞机", "火车", "自驾"];
const TRIP_STYLES: TripStyle[] = ["文艺", "美食", "自然", "人文", "小众"];

const ItineraryPlanner: React.FC = () => {
  const router = useRouter();
  
  // 步骤控制
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["输入基本信息", "选择推荐景点", "选择推荐酒店", "完善行程细节", "生成完整行程"];

  // 表单状态
  const [spotsRequest, setSpotsRequest] = useState<CreateSpotsRequest>({
    departure_city: "",
    destination_city: "",
    departure_date: dayjs().format("YYYY-MM-DD"),
    return_date: dayjs().add(3, 'day').format("YYYY-MM-DD"),
    trip_style: "自然"
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState<Location>({ name: "", address: "" });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // 酒店推荐状态
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>("");

  const [itineraryRequest, setItineraryRequest] = useState<CreateItineraryRequest>({
    user_id: "user_001",
    departure_city: "",
    destination_city: "",
    budget: { min: 1000, max: 5000 },
    departure_date: dayjs().format("YYYY-MM-DD"),
    return_date: dayjs().add(3, 'day').format("YYYY-MM-DD"),
    travellers_count: { travellers: { 成人: 1, 儿童: 0, 老人: 0, 学生: 0 } },
    transportation_preference: "飞机",
    budget_preference: ["吃饭", "住宿"],
    trip_style: "自然",
    other_requirement: "",
    spots: []
  });

  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 返回上一页面
  const handleGoBack = () => {
    router.back();
  };

  // 返回上一步骤
  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else {
      handleGoBack();
    }
  };

  // 处理景点推荐请求
  const handleCreateSpots = async () => {
    try {
      // TODO: 替换为实际接口调用
      // 模拟数据
      const mockLocations: Location[] = [
        { name: "外滩", address: "上海市黄浦区中山东一路", coordinates: { latitude: 31.2397, longitude: 121.4998 } },
        { name: "东方明珠", address: "上海市浦东新区世纪大道1号", coordinates: { latitude: 31.2397, longitude: 121.4998 } },
        { name: "豫园", address: "上海市黄浦区安仁街218号", coordinates: { latitude: 31.2274, longitude: 121.4927 } },
        { name: "南京路步行街", address: "上海市黄浦区南京东路", coordinates: { latitude: 31.2385, longitude: 121.4775 } }
      ];
      
      setLocations(mockLocations);
      setActiveStep(1);
    } catch (error) {
      console.error('获取推荐景点失败:', error);
    }
  };

  // 处理景点更新并获取酒店推荐
  const handleUpdateSpots = async () => {
    try {
      // TODO: 替换为实际接口调用
      // 模拟更新
      setLocations([...locations]);
      
      // 获取酒店推荐
      await handleGetHotelRecommendations();
      
      setActiveStep(2);
    } catch (error) {
      console.error('更新景点失败:', error);
    }
  };

  // 获取酒店推荐
  const handleGetHotelRecommendations = async () => {
    try {
      // TODO: 替换为实际接口调用
      // const response = await fetch('/api/recommend-hotels', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     destination: spotsRequest.destination_city,
      //     budget: itineraryRequest.budget,
      //     trip_style: spotsRequest.trip_style,
      //     spots: locations
      //   })
      // });
      // const hotelData: HotelRecommendation = await response.json();
      
      // 模拟酒店数据
      const mockHotels: Hotel[] = [
        {
          name: "上海外滩茂悦大酒店",
          location: {
            name: "上海外滩茂悦大酒店",
            address: "上海市虹口区黄浦路199号",
            coordinates: { latitude: 31.2479, longitude: 121.4977 }
          },
          price: 1200,
          rating: 4.8,
          description: "五星级豪华酒店，位于外滩核心区域，享有壮丽的黄浦江景",
          recommendation_reason: "地理位置优越，靠近您选择的景点，符合您的预算和风格偏好",
          url: "https://example.com/hotel1",
          amenities: ["免费WiFi", "停车场", "游泳池", "健身房", "餐厅"]
        },
        {
          name: "上海豫园万丽酒店",
          location: {
            name: "上海豫园万丽酒店",
            address: "上海市黄浦区河南南路159号",
            coordinates: { latitude: 31.2274, longitude: 121.4927 }
          },
          price: 800,
          rating: 4.5,
          description: "四星级商务酒店，靠近豫园和南京路步行街",
          recommendation_reason: "性价比高，距离您选择的多个景点都很近",
          url: "https://example.com/hotel2",
          amenities: ["免费WiFi", "餐厅", "商务中心"]
        },
        {
          name: "上海浦东香格里拉大酒店",
          location: {
            name: "上海浦东香格里拉大酒店",
            address: "上海市浦东新区富城路33号",
            coordinates: { latitude: 31.2458, longitude: 121.4987 }
          },
          price: 1500,
          rating: 4.9,
          description: "超五星级奢华酒店，位于陆家嘴金融区，直面东方明珠",
          recommendation_reason: "顶级奢华体验，完美匹配您的预算上限",
          url: "https://example.com/hotel3",
          amenities: ["免费WiFi", "停车场", "游泳池", "水疗中心", "多个餐厅", "健身房"]
        }
      ];
      
      setHotels(mockHotels);
    } catch (error) {
      console.error('获取酒店推荐失败:', error);
    }
  };

  // 选择酒店并继续
  const handleSelectHotel = () => {
    const selected = hotels.find(hotel => hotel.name === selectedHotel);
    if (selected) {
      setItineraryRequest(prev => ({
        ...prev,
        spots: locations,
        departure_city: spotsRequest.departure_city,
        destination_city: spotsRequest.destination_city,
        departure_date: spotsRequest.departure_date,
        return_date: spotsRequest.return_date,
        trip_style: spotsRequest.trip_style,
        selected_hotel: selected
      }));
      setActiveStep(3);
    }
  };

  // 生成完整行程
  const handleGenerateItinerary = async () => {
    try {
      // TODO: 替换为实际接口调用
      // 模拟行程数据
      const mockItinerary = {
        trip_id: "shanghai_trip_001",
        trip_name: "上海经典三日游",
        destination: "上海",
        start_date: itineraryRequest.departure_date,
        end_date: itineraryRequest.return_date,
        days: [
          {
            date: itineraryRequest.departure_date,
            day_of_week: "星期一",
            day_index: 0,
            total_cost: 1200,
            activities: [
              {
                id: "activity_1",
                type: "activity",
                start_time: "10:00",
                end_time: "12:00",
                title: "抵达上海并办理酒店入住",
                description: `抵达上海并入住${itineraryRequest.selected_hotel?.name}`,
                cost: itineraryRequest.selected_hotel?.price || 0,
                location: itineraryRequest.selected_hotel?.location
              }
            ]
          }
        ]
      };
      
      setGeneratedItinerary(mockItinerary);
      setActiveStep(4);
    } catch (error) {
      console.error('生成行程失败:', error);
    }
  };

  // 保存行程
  const handleSaveItinerary = async () => {
    try {
      // TODO: 替换为实际接口调用
      setDialogOpen(true);
    } catch (error) {
      console.error('保存行程失败:', error);
    }
  };

  // 添加或编辑景点
  const handleAddOrEditLocation = () => {
    if (newLocation.name && newLocation.address) {
      if (editIndex !== null) {
        const updatedLocations = [...locations];
        updatedLocations[editIndex] = newLocation;
        setLocations(updatedLocations);
        setEditIndex(null);
      } else {
        setLocations([...locations, newLocation]);
      }
      setNewLocation({ name: "", address: "" });
    }
  };

  // 编辑景点
  const handleEditLocation = (index: number) => {
    setNewLocation(locations[index]);
    setEditIndex(index);
  };

  // 删除景点
  const handleDeleteLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  // 渲染酒店设施图标
  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "免费WiFi":
        return <WifiIcon fontSize="small" />;
      case "停车场":
        return <ParkingIcon fontSize="small" />;
      case "游泳池":
        return <PoolIcon fontSize="small" />;
      case "健身房":
        return <GymIcon fontSize="small" />;
      case "餐厅":
        return <RestaurantIcon2 fontSize="small" />;
      default:
        return null;
    }
  };

  // 渲染步骤内容
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="出发城市"
                  value={spotsRequest.departure_city}
                  onChange={(e) => setSpotsRequest({ ...spotsRequest, departure_city: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="目的地城市"
                  value={spotsRequest.destination_city}
                  onChange={(e) => setSpotsRequest({ ...spotsRequest, destination_city: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="出发日期"
                    value={dayjs(spotsRequest.departure_date)}
                    onChange={(newValue) => {
                      if (newValue) {
                        setSpotsRequest({ ...spotsRequest, departure_date: newValue.format("YYYY-MM-DD") });
                      }
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="返回日期"
                    value={dayjs(spotsRequest.return_date)}
                    onChange={(newValue) => {
                      if (newValue) {
                        setSpotsRequest({ ...spotsRequest, return_date: newValue.format("YYYY-MM-DD") });
                      }
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>行程风格</FormLabel>
                  <Select
                    value={spotsRequest.trip_style}
                    onChange={(e) => setSpotsRequest({ ...spotsRequest, trip_style: e.target.value as TripStyle })}
                  >
                    {TRIP_STYLES.map((style) => (
                      <MenuItem key={style} value={style}>{style}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" onClick={handleCreateSpots}>
                获取推荐景点
              </Button>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              推荐景点列表
            </Typography>
            
            <List>
              {locations.map((location, index) => (
                <ListItem key={index} divider>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{location.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {location.address}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleEditLocation(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteLocation(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                {editIndex !== null ? '编辑景点' : '添加新景点'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="景点名称"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="地址"
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                  />
                </Grid>
              </Grid>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddOrEditLocation}
                sx={{ mt: 2 }}
              >
                {editIndex !== null ? '更新景点' : '添加景点'}
              </Button>
              {editIndex !== null && (
                <Button
                  variant="text"
                  onClick={() => {
                    setNewLocation({ name: "", address: "" });
                    setEditIndex(null);
                  }}
                  sx={{ mt: 2, ml: 2 }}
                >
                  取消编辑
                </Button>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handlePreviousStep}>
                上一步
              </Button>
              <Button variant="contained" onClick={handleUpdateSpots}>
                确认景点并选择酒店
              </Button>
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              推荐酒店列表
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              根据您的行程偏好和预算，为您推荐以下酒店
            </Typography>
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
              >
                {hotels.map((hotel, index) => (
                  <Card key={index} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Radio value={hotel.name} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{hotel.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={hotel.rating} readOnly precision={0.1} size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {hotel.rating}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {hotel.location.address}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {hotel.description}
                        </Typography>
                        <Typography variant="body2" color="primary" gutterBottom>
                          💡 {hotel.recommendation_reason}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2">设施：</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {hotel.amenities.map((amenity, idx) => (
                              <Chip
                                key={idx}
                                icon={renderAmenityIcon(amenity)}
                                label={amenity}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary">
                            ¥{hotel.price}/晚
                          </Typography>
                          {hotel.url && (
                            <Button
                              size="small"
                              href={hotel.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              查看详情
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handlePreviousStep}>
                上一步
              </Button>
              <Button
                variant="contained"
                onClick={handleSelectHotel}
                disabled={!selectedHotel}
              >
                选择酒店并继续
              </Button>
            </Box>
          </Box>
        );
      
      case 3:
        return (
          <Box component="form" sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              完善行程细节
            </Typography>
            
            {itineraryRequest.selected_hotel && (
              <Card sx={{ mb: 3, bgcolor: 'success.light' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    🏨 已选择酒店: {itineraryRequest.selected_hotel.name}
                  </Typography>
                  <Typography variant="body2">
                    价格: ¥{itineraryRequest.selected_hotel.price}/晚 · 评分: {itineraryRequest.selected_hotel.rating}
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="预算下限（元）"
                  type="number"
                  value={itineraryRequest.budget.min}
                  onChange={(e) => setItineraryRequest({
                    ...itineraryRequest,
                    budget: { ...itineraryRequest.budget, min: Number(e.target.value) }
                  })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="预算上限（元）"
                  type="number"
                  value={itineraryRequest.budget.max}
                  onChange={(e) => setItineraryRequest({
                    ...itineraryRequest,
                    budget: { ...itineraryRequest.budget, max: Number(e.target.value) }
                  })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">出行人员</FormLabel>
                  <FormGroup row>
                    {TRAVELLER_TYPES.map((type) => (
                      <TextField
                        key={type}
                        label={type}
                        type="number"
                        value={itineraryRequest.travellers_count.travellers[type]}
                        onChange={(e) => setItineraryRequest({
                          ...itineraryRequest,
                          travellers_count: {
                            travellers: {
                              ...itineraryRequest.travellers_count.travellers,
                              [type]: Math.max(0, Number(e.target.value))
                            }
                          }
                        })}
                        sx={{ mr: 2, width: 100 }}
                        inputProps={{ min: 0 }}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel>交通工具偏好</FormLabel>
                  <Select
                    value={itineraryRequest.transportation_preference}
                    onChange={(e) => setItineraryRequest({
                      ...itineraryRequest,
                      transportation_preference: e.target.value as TransportationPreference
                    })}
                  >
                    {TRANSPORTATION_PREFERENCES.map((pref) => (
                      <MenuItem key={pref} value={pref}>{pref}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">预算偏好（多选）</FormLabel>
                  <FormGroup row>
                    {BUDGET_PREFERENCES.map((pref) => (
                      <FormControlLabel
                        key={pref}
                        control={
                          <Checkbox
                            checked={itineraryRequest.budget_preference.includes(pref)}
                            onChange={(e) => {
                              const newPreferences = e.target.checked
                                ? [...itineraryRequest.budget_preference, pref]
                                : itineraryRequest.budget_preference.filter(p => p !== pref);
                              setItineraryRequest({
                                ...itineraryRequest,
                                budget_preference: newPreferences
                              });
                            }}
                          />
                        }
                        label={pref}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="其他需求"
                  value={itineraryRequest.other_requirement}
                  onChange={(e) => setItineraryRequest({
                    ...itineraryRequest,
                    other_requirement: e.target.value
                  })}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handlePreviousStep}>
                上一步
              </Button>
              <Button variant="contained" onClick={handleGenerateItinerary}>
                生成完整行程
              </Button>
            </Box>
          </Box>
        );
      
      case 4:
        return (
          <Box sx={{ mt: 3 }}>
            {generatedItinerary ? (
              <>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {generatedItinerary.trip_name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {generatedItinerary.destination} · {generatedItinerary.start_date} 至 {generatedItinerary.end_date}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip label={`预算: ¥${itineraryRequest.budget.min}-${itineraryRequest.budget.max}`} variant="outlined" sx={{ mr: 1 }} />
                      <Chip label={itineraryRequest.transportation_preference} variant="outlined" sx={{ mr: 1 }} />
                      <Chip label={itineraryRequest.trip_style} variant="outlined" />
                      {itineraryRequest.selected_hotel && (
                        <Chip 
                          icon={<HotelIcon />} 
                          label={`酒店: ${itineraryRequest.selected_hotel.name}`} 
                          variant="outlined" 
                          sx={{ mr: 1, mt: 1 }} 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
                
                <Typography variant="h6" gutterBottom>
                  每日行程安排
                </Typography>
                
                {generatedItinerary.days.map((day: any, index: number) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        第{index + 1}天 - {day.date} ({day.day_of_week})
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        总费用: ¥{day.total_cost || 0}
                      </Typography>
                      
                      {day.activities.map((activity: any, activityIndex: number) => (
                        <Box key={activityIndex} sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {activity.type === 'transportation' ? (
                              <FlightIcon color="action" sx={{ mr: 1 }} />
                            ) : (
                              activity.title.includes('酒店') ? (
                                <HotelIcon color="action" sx={{ mr: 1 }} />
                              ) : activity.title.includes('餐') ? (
                                <RestaurantIcon color="action" sx={{ mr: 1 }} />
                              ) : (
                                <AttractionsIcon color="action" sx={{ mr: 1 }} />
                              )
                            )}
                            <Typography variant="subtitle1">
                              {activity.start_time} - {activity.end_time}: {activity.title}
                            </Typography>
                            {activity.cost > 0 && (
                              <Chip label={`¥${activity.cost}`} size="small" sx={{ ml: 'auto' }} />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {activity.description}
                          </Typography>
                          {activity.location && (
                            <Typography variant="body2">
                              地点: {activity.location.name} ({activity.location.address})
                            </Typography>
                          )}
                          {activityIndex < day.activities.length - 1 && <Divider sx={{ my: 2 }} />}
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                ))}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button onClick={handlePreviousStep}>
                    上一步
                  </Button>
                  <Button variant="contained" onClick={handleSaveItinerary}>
                    保存行程
                  </Button>
                </Box>
              </>
            ) : (
              <Typography>生成行程中...</Typography>
            )}
          </Box>
        );
      
      default:
        return <Typography>未知步骤</Typography>;
    }
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            智能行程规划
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent(activeStep)}
        </Paper>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>行程保存成功</DialogTitle>
          <DialogContent>
            <Typography>您的行程已成功保存！您可以在"我的行程"页面查看和管理。</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>确定</Button>
            <Button 
              onClick={() => {
                setDialogOpen(false);
                handleGoBack();
              }}
              variant="contained"
            >
              返回首页
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default ItineraryPlanner;