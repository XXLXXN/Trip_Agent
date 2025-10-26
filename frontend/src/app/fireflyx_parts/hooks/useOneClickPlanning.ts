// frontend/src/app/fireflyx_parts/hooks/useOneClickPlanning.ts
"use client";

import { useState, useEffect } from 'react';
import { TripData } from '../types/tripData';

interface UseOneClickPlanningResult {
  tripData: TripData | null;
  loading: boolean;
  error: string | null;
}

export const useOneClickPlanning = (): UseOneClickPlanningResult => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOneClickPlanningData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 调用一键规划API
        const response = await fetch('/api/oneclick-planning', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // 空请求体，因为后端会返回固定数据
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch oneclick planning data: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || '一键规划API返回错误');
        }

        console.log('Fetched oneclick planning data:', result.data);
        setTripData(result.data);

      } catch (err) {
        setError('获取一键规划数据失败');
        console.error('Error fetching oneclick planning data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOneClickPlanningData();
  }, []);

  return { tripData, loading, error };
};
