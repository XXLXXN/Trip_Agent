"use client";

import { useState, useEffect } from 'react';
import { getAutoClearConfig } from '../config/accounting';

export interface AccountingRecord {
  id: string;
  category: string;
  name: string;
  description: string;
  amount: number;
  timestamp: string;
}

export interface NewAccountingRecord {
  category: string;
  name: string;
  description: string;
  amount: number;
}

interface UseAccountingDataResult {
  records: AccountingRecord[];
  loading: boolean;
  error: string | null;
  addRecord: (record: NewAccountingRecord) => Promise<void>;
  clearRecords: () => Promise<void>;
}

export const useAccountingData = (): UseAccountingDataResult => {
  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取记账记录
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/fireflyx_parts/api/accounting');
      if (!response.ok) {
        throw new Error(`Failed to fetch accounting records: ${response.status}`);
      }
      
      const data: AccountingRecord[] = await response.json();
      setRecords(data);

    } catch (err) {
      setError('获取记账记录失败');
      console.error('Error fetching accounting records:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加记账记录
  const addRecord = async (newRecord: NewAccountingRecord) => {
    try {
      // 创建完整的记录对象
      const record: AccountingRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...newRecord,
      };

      const response = await fetch('/fireflyx_parts/api/accounting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error('Failed to save accounting record');
      }

      // 更新本地状态
      setRecords(prev => [...prev, record]);

    } catch (err) {
      setError('保存记账记录失败');
      console.error('Error saving accounting record:', err);
      throw err;
    }
  };

  // 清除记账记录
  const clearRecords = async () => {
    try {
      const response = await fetch('/fireflyx_parts/api/accounting', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear accounting records');
      }

      // 清空本地状态
      setRecords([]);

    } catch (err) {
      setError('清除记账记录失败');
      console.error('Error clearing accounting records:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRecords();
    
    // 检查是否需要在服务器关闭时清除记录
    const config = getAutoClearConfig();
    if (config.onServerShutdown) {
      // 只在真正关闭浏览器标签页时清除记录
      const handlePageHide = () => {
        console.log('检测到页面关闭，清除记账记录');
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/fireflyx_parts/api/accounting', JSON.stringify({ action: 'clear' }));
        }
      };
      
      // 使用 pagehide 事件，它只在真正关闭页面时触发
      window.addEventListener('pagehide', handlePageHide);
      
      return () => {
        window.removeEventListener('pagehide', handlePageHide);
      };
    }
  }, []);

  return {
    records,
    loading,
    error,
    addRecord,
    clearRecords,
  };
};
