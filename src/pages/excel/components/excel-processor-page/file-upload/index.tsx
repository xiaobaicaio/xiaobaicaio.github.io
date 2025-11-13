import { useState, useCallback } from 'react';
import { RiCloseLine, RiFileExcelLine, RiFileLine } from '@remixicon/react';

export default function FileUpload({ onFileUpload }: {
  onFileUpload: (file: File) => void
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileUpload(selectedFile);
      }
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileUpload(droppedFile);
      }
    }
  }, [onFileUpload]);

  const validateFile = (selectedFile: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      alert('请上传有效的Excel文件 (.xlsx, .xls, .csv)');
      return false;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过10MB');
      return false;
    }

    return true;
  };


  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
        上传Excel文件
      </h3>

      <div
        className={`mt-4 flex justify-center rounded-lg border-2 border-dashed px-6 py-12 cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => {
          e.preventDefault();
          const input = document.getElementById('file-upload') as HTMLInputElement;
          if (input) {
            input.value = ''; // 重置input，确保同一文件可以再次触发onChange
            input.click();
          }
        }}
      >
        <div className="text-center">
          <div className="mt-4 flex text-sm/6 text-gray-500 dark:text-gray-500">
            <p>拖放或</p>
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md pl-1 font-medium text-blue-500 hover:underline hover:underline-offset-4 dark:text-blue-500"
              onClick={(e) => e.stopPropagation()} // 阻止事件冒泡到父级div
            >
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">上传Excel文件</p>
          </div>
        </div>
      </div>
    </div>
  );
}