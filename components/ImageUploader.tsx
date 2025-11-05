import React, { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { fileToBase64 } from '../utils/fileUtils';

interface ImageUploaderProps {
  onImageUpload: (image: { base64: string; mimeType: string; name: string }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const base64 = await fileToBase64(file);
        const dataUrl = URL.createObjectURL(file);
        setPreview(dataUrl);
        setFileName(file.name);
        onImageUpload({ base64, mimeType: file.type, name: file.name });
      } catch (error) {
        console.error('Error processing file:', error);
        // TODO: show error to user
      }
    }
  }, [onImageUpload]);

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find(f => f.type.startsWith('image/'));
      if (file) {
        // To give user feedback, we can simulate a drop effect
        setIsDragging(true);
        await handleFileChange(file);
        setTimeout(() => setIsDragging(false), 200);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handleFileChange]);

  const onDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label
        onDragEnter={onDragEnter}
        onDragOver={onDragEnter} // for drop to work
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-gray-700/50' : 'border-gray-600 hover:border-indigo-500'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {preview ? (
          <img src={preview} alt="Uploaded preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="mx-auto h-12 w-12" />
            <p className="mt-2">Drag & drop or paste an image</p>
            <p className="text-xs">or</p>
            <button type="button" onClick={onButtonClick} className="font-semibold text-indigo-400 hover:text-indigo-300">
              Click to upload
            </button>
          </div>
        )}
      </label>
      {fileName && (
        <p className="text-sm text-gray-500">
          File: <span className="font-medium text-gray-300">{fileName}</span>
        </p>
      )}
    </div>
  );
};
