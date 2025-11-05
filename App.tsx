
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImage } from './components/GeneratedImage';
import { editImage } from './services/geminiService';

interface UploadedImage {
  base64: string;
  mimeType: string;
  name: string;
}

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState<string>(
    'A full-body image of the same woman, keeping the exact same background, face, facial features, body pose, and body shape. She is now wearing a small, loose, black or white ultra-short silk gown. The gown has a dramatic deep neckline plunge from collarbone to waist, ends mid-thigh in a frock style, and is held by delicate, ultra-thin rope-like straps. She is wearing heels. Ensure the new clothing fits naturally.'
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((image: UploadedImage) => {
    setUploadedImage(image);
    setGeneratedImage(null);
    setError(null);
  }, []);
  
  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const newImageBase64 = await editImage({
        base64ImageData: uploadedImage.base64,
        mimeType: uploadedImage.mimeType,
        prompt: prompt,
      });
      setGeneratedImage(`data:image/jpeg;base64,${newImageBase64}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Controls */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-indigo-400">1. Upload Your Image</h2>
            <ImageUploader onImageUpload={handleImageUpload} />
            
            <h2 className="text-2xl font-bold text-indigo-400">2. Describe the Outfit</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-48 p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
              placeholder="Describe the desired outfit change..."
            />
            
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 duration-300 ease-in-out"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : '✨ Generate New Outfit'}
            </button>
          </div>

          {/* Right Column: Result */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6">3. See the Result</h2>
            <GeneratedImage 
              isLoading={isLoading}
              error={error}
              imageUrl={generatedImage}
              originalImageUrl={uploadedImage ? `data:${uploadedImage.mimeType};base64,${uploadedImage.base64}` : null}
            />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Gemini. Create your own fashion visions.</p>
      </footer>
    </div>
  );
};

export default App;
