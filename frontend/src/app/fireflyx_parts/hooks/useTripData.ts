// frontend/src/app/fireflyx_parts/hooks/useTripData.ts
"use client";

import { useState, useEffect } from 'react';
import { TripData, ActivityData } from '../types/tripData';

interface UseTripDataResult {
  tripData: TripData | null;
  loading: boolean;
  error: string | null;
}

export const useTripData = (): UseTripDataResult => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        setError(null);

              // 直接从 SAMPLE_TRIP_DATA_2.json 文件获取数据
              const response = await fetch('/fireflyx_parts/api/trip-data');
        if (!response.ok) {
          throw new Error(`Failed to fetch trip data: ${response.status}`);
        }
        const data: TripData = await response.json();
        
        console.log('Fetched trip data:', data); // 添加调试信息
        setTripData(data);

      } catch (err) {
        setError('获取行程数据失败');
        console.error('Error fetching trip data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, []);

  return { tripData, loading, error };
};
