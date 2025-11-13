import { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from './file-upload';

export default function ExcelProcessorPage() {
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [mergedCells, setMergedCells] = useState({});

  const handleFileUpload = (file) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result );
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // 获取Excel数据
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // 提取表头
      if (jsonData.length > 0) {
        setHeaders(jsonData[0]);
      }

      // 处理合并单元格
      const newMergedCells= {};
      if (worksheet['!merges']) {
        worksheet['!merges'].forEach(merge => {
          for (let r = merge.s.r; r <= merge.e.r; r++) {
            for (let c = merge.s.c; c <= merge.e.c; c++) {
              const cellKey = `${r}-${c}`;
              // 只标记非起始单元格
              if (r !== merge.s.r || c !== merge.s.c) {
                newMergedCells[cellKey] = {
                  rowSpan: 0,
                  colSpan: 0
                };
              } else {
                // 起始单元格记录合并范围
                newMergedCells[cellKey] = {
                  rowSpan: merge.e.r - merge.s.r + 1,
                  colSpan: merge.e.c - merge.s.c + 1
                };
              }
            }
          }
        });
      }

      setMergedCells(newMergedCells);
      setExcelData(jsonData.slice(1)); // 跳过表头
    };
    reader.readAsArrayBuffer(file);
  };

  console.log("===jsonData", excelData)




  return (
    <div className="p-6">
      <div className="p-6 mb-6">
        <FileUpload onFileUpload={handleFileUpload} />
        {fileName && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            已上传文件: {fileName}
          </div>
        )}
      </div>

    </div>
  );
}