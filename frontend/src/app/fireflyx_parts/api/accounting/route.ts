import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ACCOUNTING_FILE_PATH = path.join(process.cwd(), '..', 'backend', 'DataDefinition', 'accounting_records.json');

// 确保文件存在
function ensureAccountingFile() {
  if (!fs.existsSync(ACCOUNTING_FILE_PATH)) {
    fs.writeFileSync(ACCOUNTING_FILE_PATH, JSON.stringify([]));
  }
}

// 清除记账记录
function clearAccountingRecords() {
  try {
    if (fs.existsSync(ACCOUNTING_FILE_PATH)) {
      fs.writeFileSync(ACCOUNTING_FILE_PATH, JSON.stringify([]));
      console.log('记账记录已清除');
    }
  } catch (error) {
    console.error('清除记账记录失败:', error);
  }
}

// 服务器关闭时自动清除（延迟注册，避免启动时触发）
let signalHandlersRegistered = false;

function registerSignalHandlers() {
  if (signalHandlersRegistered) return;
  
  process.on('SIGINT', () => {
    console.log('检测到服务器关闭信号，正在清除记账记录...');
    clearAccountingRecords();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('检测到服务器终止信号，正在清除记账记录...');
    clearAccountingRecords();
    process.exit(0);
  });
  
  signalHandlersRegistered = true;
  console.log('服务器关闭信号监听器已注册');
}

// 保存记账记录
export async function POST(request: NextRequest) {
  try {
    ensureAccountingFile();
    
    const body = await request.json();
    
    // 检查是否是清除请求（来自 sendBeacon）
    if (body.action === 'clear') {
      clearAccountingRecords();
      return NextResponse.json({ success: true, action: 'cleared' });
    }
    
    // 正常的添加记录请求
    const record = body;
    
    // 读取现有记录
    const existingRecords = JSON.parse(fs.readFileSync(ACCOUNTING_FILE_PATH, 'utf8'));
    
    // 添加新记录
    existingRecords.push(record);
    
    // 写回文件
    fs.writeFileSync(ACCOUNTING_FILE_PATH, JSON.stringify(existingRecords, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存记账记录失败:', error);
    return NextResponse.json({ error: '保存失败' }, { status: 500 });
  }
}

// 获取记账记录
export async function GET(request: NextRequest) {
  // 注册信号监听器（只在第一次访问时注册）
  registerSignalHandlers();
  
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  
  if (action === 'status') {
    // 返回服务器状态
    try {
      ensureAccountingFile();
      const records = JSON.parse(fs.readFileSync(ACCOUNTING_FILE_PATH, 'utf8'));
      return NextResponse.json({ 
        status: 'running', 
        timestamp: Date.now(),
        recordCount: records.length 
      });
    } catch (error) {
      // --- 修改开始 ---
      // 安全地处理错误，检查 error 是否为 Error 的实例
      const errorMessage = error instanceof Error ? error.message : '获取服务器状态时发生未知错误';
      
      return NextResponse.json({ 
        status: 'error', 
        timestamp: Date.now(),
        error: errorMessage 
      }, { status: 500 });
      // --- 修改结束 ---
    }
  }
  
  // 默认行为：获取记账记录
  try {
    console.log('ACCOUNTING_FILE_PATH:', ACCOUNTING_FILE_PATH);
    console.log('File exists:', fs.existsSync(ACCOUNTING_FILE_PATH));
    
    ensureAccountingFile();
    
    const records = JSON.parse(fs.readFileSync(ACCOUNTING_FILE_PATH, 'utf8'));
    
    return NextResponse.json(records);
  } catch (error) {
    console.error('读取记账记录失败:', error);
    return NextResponse.json({ error: '读取失败' }, { status: 500 });
  }
}

// 清除记账记录
export async function DELETE() {
  try {
    clearAccountingRecords();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('清除记账记录失败:', error);
    return NextResponse.json({ error: '清除失败' }, { status: 500 });
  }
}

// 健康检查（用于检测服务器状态）
export async function HEAD() {
  try {
    ensureAccountingFile();
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('健康检查失败:', error);
    return new NextResponse(null, { status: 500 });
  }
}
