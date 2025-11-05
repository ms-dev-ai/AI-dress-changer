import React, { useState } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { CopyIcon } from './icons/CopyIcon';

interface GeneratedImageProps {
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
  originalImageUrl: string | null;
}

const ImagePlaceholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="w-full h-full flex flex-col justify-center items-center text-gray-500 bg-gray-700/50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-center">{message}</p>
    </div>
);

const SkeletonLoader: React.FC = () => (
    <div className="w-full h-full bg-gray-700 rounded-lg animate-pulse"></div>
);

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ isLoading, error, imageUrl, originalImageUrl }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-outfit-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (!imageUrl || isCopied) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      alert('Failed to copy image. Your browser might not support this feature.');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader />;
    }
    if (error) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center text-red-400 bg-red-900/20 rounded-lg p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-bold text-lg">Generation Failed</p>
            <p className="text-sm text-center mt-2">{error}</p>
        </div>
      );
    }
    if (imageUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="flex-grow w-full flex items-center justify-center overflow-hidden">
                <img src={imageUrl} alt="Generated outfit" className="max-h-full max-w-full object-contain rounded-md" />
            </div>
            <div className="flex-shrink-0 flex space-x-3">
                <button onClick={handleDownload} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Download
                </button>
                <button onClick={handleCopy} disabled={isCopied} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 disabled:opacity-70 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                    <CopyIcon className="h-5 w-5 mr-2" />
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
      );
    }
    if (originalImageUrl) {
        return <img src={originalImageUrl} alt="Original uploaded image" className="max-h-full max-w-full object-contain rounded-md opacity-50" />;
    }
    return <ImagePlaceholder message="Your generated image will appear here." />;
  };

  return (
    <div className="aspect-w-1 aspect-h-1 w-full h-full min-h-[300px] bg-gray-900/50 rounded-lg flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
};
