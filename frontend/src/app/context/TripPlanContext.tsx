"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// 照片数据类型
export interface Photo {
  url: string;
  title: string;
}

// 景点推荐数据类型
export interface SpotRecommendation {
  SpotName: string;
  RecReason: string;
  POIId: string;
  description: string;
  address: string;
  photos: Photo[];
  rating: string;
}

// 酒店推荐数据类型
export interface HotelRecommendation {
  SpotName: string;
  RecReason: string;
  POIId: string;
  description: string;
  address: string;
  photos: Photo[];
  rating: string;
  cost: number;
}

// 旅行规划数据类型
export interface TripPlanData {
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  elderly: number;
  children: number;
  priceRange: number[];
  selectedTransport: string;
  selectedAccommodation: string;
  selectedStyles: string[];
  additionalRequirements: string;
  // 后端返回的景点推荐数据
  spotRecommendations?: SpotRecommendation[];
  // 用户选择的景点信息（完整信息）
  selectedSpots?: SpotRecommendation[];
  // 后端返回的酒店推荐数据
  hotelRecommendations?: HotelRecommendation[];
  // 用户选择的酒店信息（完整信息）
  selectedHotels?: HotelRecommendation[];
  // 其他后端返回的数据
  backendData?: any;
}

// 状态类型
interface TripPlanState {
  data: TripPlanData | null;
  isLoading: boolean;
  error: string | null;
}

// Action类型
type TripPlanAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DATA"; payload: TripPlanData }
  | { type: "SET_SPOT_RECOMMENDATIONS"; payload: SpotRecommendation[] }
  | { type: "SET_SELECTED_SPOTS"; payload: SpotRecommendation[] }
  | { type: "SET_HOTEL_RECOMMENDATIONS"; payload: HotelRecommendation[] }
  | { type: "SET_SELECTED_HOTELS"; payload: HotelRecommendation[] }
  | { type: "CLEAR_DATA" };

// 初始状态
const initialState: TripPlanState = {
  data: null,
  isLoading: false,
  error: null,
};

// Reducer
function tripPlanReducer(
  state: TripPlanState,
  action: TripPlanAction
): TripPlanState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_DATA":
      return { ...state, data: action.payload, isLoading: false, error: null };
    case "SET_SPOT_RECOMMENDATIONS":
      return {
        ...state,
        data: state.data
          ? {
              ...state.data,
              spotRecommendations: action.payload,
            }
          : null,
        isLoading: false,
        error: null,
      };
    case "SET_SELECTED_SPOTS":
      return {
        ...state,
        data: state.data
          ? {
              ...state.data,
              selectedSpots: action.payload,
            }
          : null,
        isLoading: false,
        error: null,
      };
    case "SET_HOTEL_RECOMMENDATIONS":
      return {
        ...state,
        data: state.data
          ? {
              ...state.data,
              hotelRecommendations: action.payload,
            }
          : null,
        isLoading: false,
        error: null,
      };
    case "SET_SELECTED_HOTELS":
      return {
        ...state,
        data: state.data
          ? {
              ...state.data,
              selectedHotels: action.payload,
            }
          : null,
        isLoading: false,
        error: null,
      };
    case "CLEAR_DATA":
      return { ...initialState };
    default:
      return state;
  }
}

// Context
const TripPlanContext = createContext<{
  state: TripPlanState;
  dispatch: React.Dispatch<TripPlanAction>;
  saveTripPlan: (data: TripPlanData) => void;
  saveSpotRecommendations: (recommendations: SpotRecommendation[]) => void;
  saveSelectedSpots: (selectedSpots: SpotRecommendation[]) => void;
  saveHotelRecommendations: (recommendations: HotelRecommendation[]) => void;
  saveSelectedHotels: (selectedHotels: HotelRecommendation[]) => void;
  clearTripPlan: () => void;
  getTripPlan: () => TripPlanData | null;
  getSpotRecommendations: () => SpotRecommendation[] | null;
  getSelectedSpots: () => SpotRecommendation[] | null;
  getHotelRecommendations: () => HotelRecommendation[] | null;
  getSelectedHotels: () => HotelRecommendation[] | null;
} | null>(null);

// Provider组件
export function TripPlanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripPlanReducer, initialState);

  // 从sessionStorage恢复数据（如果存在）
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem("tripPlanData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: "SET_DATA", payload: parsedData });
      }
    } catch (error) {
      console.error(
        "Failed to load trip plan data from sessionStorage:",
        error
      );
      // 清除损坏的数据
      sessionStorage.removeItem("tripPlanData");
    }
  }, []);

  // 保存旅行规划数据到sessionStorage和状态
  const saveTripPlan = (data: TripPlanData) => {
    try {
      // 保存到sessionStorage（会话级别存储）
      sessionStorage.setItem("tripPlanData", JSON.stringify(data));
      // 更新状态
      dispatch({ type: "SET_DATA", payload: data });
    } catch (error) {
      console.error("Failed to save trip plan data:", error);
      dispatch({ type: "SET_ERROR", payload: "保存数据失败" });
    }
  };

  // 保存景点推荐数据
  const saveSpotRecommendations = (recommendations: SpotRecommendation[]) => {
    try {
      // 获取当前数据
      const currentData = getTripPlan();
      const updatedData = {
        ...(currentData || {}),
        spotRecommendations: recommendations,
      } as TripPlanData;

      // 保存到sessionStorage和状态
      sessionStorage.setItem("tripPlanData", JSON.stringify(updatedData));
      dispatch({ type: "SET_SPOT_RECOMMENDATIONS", payload: recommendations });
    } catch (error) {
      console.error("Failed to save spot recommendations:", error);
      dispatch({ type: "SET_ERROR", payload: "保存景点推荐数据失败" });
    }
  };

  // 清除旅行规划数据
  const clearTripPlan = () => {
    try {
      sessionStorage.removeItem("tripPlanData");
      dispatch({ type: "CLEAR_DATA" });
    } catch (error) {
      console.error("Failed to clear trip plan data:", error);
    }
  };

  // 获取当前旅行规划数据
  const getTripPlan = (): TripPlanData | null => {
    return state.data;
  };

  // 保存用户选择的景点信息
  const saveSelectedSpots = (selectedSpots: SpotRecommendation[]) => {
    try {
      // 获取当前数据
      const currentData = getTripPlan();
      const updatedData = {
        ...(currentData || {}),
        selectedSpots: selectedSpots,
      } as TripPlanData;

      // 保存到sessionStorage和状态
      sessionStorage.setItem("tripPlanData", JSON.stringify(updatedData));
      dispatch({ type: "SET_SELECTED_SPOTS", payload: selectedSpots });
    } catch (error) {
      console.error("Failed to save selected spots:", error);
      dispatch({ type: "SET_ERROR", payload: "保存选择的景点信息失败" });
    }
  };

  // 获取景点推荐数据
  const getSpotRecommendations = (): SpotRecommendation[] | null => {
    return state.data?.spotRecommendations || null;
  };

  // 获取用户选择的景点信息
  const getSelectedSpots = (): SpotRecommendation[] | null => {
    return state.data?.selectedSpots || null;
  };

  // 保存酒店推荐数据
  const saveHotelRecommendations = (recommendations: HotelRecommendation[]) => {
    try {
      // 获取当前数据
      const currentData = getTripPlan();
      const updatedData = {
        ...(currentData || {}),
        hotelRecommendations: recommendations,
      } as TripPlanData;

      // 保存到sessionStorage和状态
      sessionStorage.setItem("tripPlanData", JSON.stringify(updatedData));
      dispatch({ type: "SET_HOTEL_RECOMMENDATIONS", payload: recommendations });
    } catch (error) {
      console.error("Failed to save hotel recommendations:", error);
      dispatch({ type: "SET_ERROR", payload: "保存酒店推荐数据失败" });
    }
  };

  // 保存用户选择的酒店信息
  const saveSelectedHotels = (selectedHotels: HotelRecommendation[]) => {
    try {
      // 获取当前数据
      const currentData = getTripPlan();
      const updatedData = {
        ...(currentData || {}),
        selectedHotels: selectedHotels,
      } as TripPlanData;

      // 保存到sessionStorage和状态
      sessionStorage.setItem("tripPlanData", JSON.stringify(updatedData));
      dispatch({ type: "SET_SELECTED_HOTELS", payload: selectedHotels });
    } catch (error) {
      console.error("Failed to save selected hotels:", error);
      dispatch({ type: "SET_ERROR", payload: "保存选择的酒店信息失败" });
    }
  };

  // 获取酒店推荐数据
  const getHotelRecommendations = (): HotelRecommendation[] | null => {
    return state.data?.hotelRecommendations || null;
  };

  // 获取用户选择的酒店信息
  const getSelectedHotels = (): HotelRecommendation[] | null => {
    return state.data?.selectedHotels || null;
  };

  return (
    <TripPlanContext.Provider
      value={{
        state,
        dispatch,
        saveTripPlan,
        saveSpotRecommendations,
        saveSelectedSpots,
        saveHotelRecommendations,
        saveSelectedHotels,
        clearTripPlan,
        getTripPlan,
        getSpotRecommendations,
        getSelectedSpots,
        getHotelRecommendations,
        getSelectedHotels,
      }}
    >
      {children}
    </TripPlanContext.Provider>
  );
}

// Hook
export function useTripPlan() {
  const context = useContext(TripPlanContext);
  if (!context) {
    throw new Error("useTripPlan must be used within a TripPlanProvider");
  }
  return context;
}
