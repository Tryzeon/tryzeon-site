#!/usr/bin/env node

/**
 * Bundle 分析腳本
 * 用於分析打包後的檔案大小和依賴關係
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../.next');

function getDirectorySize(dirPath) {
  let size = 0;
  
  if (!fs.existsSync(dirPath)) {
    return 0;
  }

  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  });
  
  return size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeBuild() {
  console.log('\n📊 Bundle 分析報告\n');
  console.log('='.repeat(50));
  
  // 分析主要目錄
  const directories = [
    { name: 'Static Files', path: path.join(BUILD_DIR, 'static') },
    { name: 'Server', path: path.join(BUILD_DIR, 'server') },
    { name: 'Cache', path: path.join(BUILD_DIR, 'cache') },
  ];
  
  let totalSize = 0;
  
  directories.forEach(dir => {
    const size = getDirectorySize(dir.path);
    totalSize += size;
    console.log(`\n${dir.name}:`);
    console.log(`  大小: ${formatBytes(size)}`);
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n總大小: ${formatBytes(totalSize)}\n`);
  
  // 檢查是否有大型檔案
  console.log('\n⚠️  大型檔案檢查 (> 500KB):\n');
  
  function findLargeFiles(dirPath, threshold = 500 * 1024) {
    if (!fs.existsSync(dirPath)) return [];
    
    const largeFiles = [];
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        largeFiles.push(...findLargeFiles(filePath, threshold));
      } else if (stats.size > threshold) {
        largeFiles.push({
          path: filePath.replace(BUILD_DIR, '.next'),
          size: stats.size
        });
      }
    });
    
    return largeFiles;
  }
  
  const largeFiles = findLargeFiles(BUILD_DIR);
  
  if (largeFiles.length === 0) {
    console.log('  ✅ 沒有發現大型檔案\n');
  } else {
    largeFiles
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        console.log(`  📦 ${file.path}`);
        console.log(`     ${formatBytes(file.size)}\n`);
      });
  }
  
  // 建議
  console.log('💡 優化建議:\n');
  console.log('  1. 使用 dynamic import 延遲載入大型組件');
  console.log('  2. 優化圖片格式（使用 WebP/AVIF）');
  console.log('  3. 移除未使用的依賴套件');
  console.log('  4. 啟用 gzip/brotli 壓縮');
  console.log('  5. 使用 CDN 託管靜態資源\n');
}

// 執行分析
if (fs.existsSync(BUILD_DIR)) {
  analyzeBuild();
} else {
  console.error('❌ 找不到 .next 目錄，請先執行 npm run build');
  process.exit(1);
}
