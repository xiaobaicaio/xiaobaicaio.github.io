import { useState } from "react";
import * as XLSX from "xlsx";
import ExcelDataTable from "./excel-data-table";
import FileUpload from "./file-upload";

export default function ExcelProcessorPage () {
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("");
  const [mergedCells, setMergedCells] = useState({});

  const handleFileUpload = (file) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // 获取Excel数据
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // 提取表头
      if (jsonData.length > 0) {
        setHeaders(jsonData[0]);
      }

      // 处理合并单元格
      const newMergedCells = {};
      if (worksheet["!merges"]) {
        worksheet["!merges"].forEach((merge) => {
          for (let r = merge.s.r; r <= merge.e.r; r++) {
            for (let c = merge.s.c; c <= merge.e.c; c++) {
              const cellKey = `${r}-${c}`;
              // 只标记非起始单元格
              if (r !== merge.s.r || c !== merge.s.c) {
                newMergedCells[cellKey] = {
                  rowSpan: 0,
                  colSpan: 0,
                };
              } else {
                // 起始单元格记录合并范围
                newMergedCells[cellKey] = {
                  rowSpan: merge.e.r - merge.s.r + 1,
                  colSpan: merge.e.c - merge.s.c + 1,
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

  // 格式化数据函数
  const formatData = (data, headers) => {
    // 创建包含表头的完整数据
    const formattedData = [headers, ...data];

    // 对数据进行排序（按第一列升序）
    const rowsToSort = formattedData.slice(1);
    rowsToSort.sort((a, b) => {
      if (a[0] && b[0]) {
        return String(a[0]).localeCompare(String(b[0]));
      }
      return 0;
    });

    return [headers, ...rowsToSort];
  };

  // 下载Excel文件函数
  const downloadExcel = () => {
    if (excelData.length === 0 || headers.length === 0) {
      alert("没有数据可以导出");
      return;
    }

    // 格式化数据
    const formattedData = formatData(excelData, headers);

    // 创建工作簿和工作表
    const ws = XLSX.utils.aoa_to_sheet(formattedData);

    // 设置单元格样式（基本格式化）
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");

    // 为表头设置样式
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c });
      ws[cellAddress] = ws[cellAddress] || {};
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F86C6" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    // 为数据单元格设置基本样式
    for (let r = 1; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r, c });
        ws[cellAddress] = ws[cellAddress] || {};
        ws[cellAddress].s = {
          alignment: { vertical: "center" },
        };
      }
    }

    // 创建工作簿并下载
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // 使用与上传文件相似的名称，但添加格式化后缀
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const newFileName = `${baseName}_格式化.xlsx`;

    XLSX.writeFile(wb, newFileName);
  };

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

      {/* 下载文件按钮 */}
      <div className="p-6 mb-6">
        <button
          onClick={downloadExcel}
          disabled={excelData.length === 0 || headers.length === 0}
          className={`px-6 py-3 rounded-md text-white font-medium transition-all ${excelData.length === 0 || headers.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          保存并格式化
        </button>
        {excelData.length === 0 && (
          <span className="ml-2 text-gray-500">请先上传Excel文件</span>
        )}
      </div>
      {/* 显示Excel数据表格 */}
      {excelData.length > 0 && headers.length > 0 && (
        <div className="p-6 mb-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Excel数据</h3>
          <ExcelDataTable
            headers={headers}
            data={excelData}
            mergedCells={mergedCells}
          />
        </div>
      )}
    </div>
  );
}
