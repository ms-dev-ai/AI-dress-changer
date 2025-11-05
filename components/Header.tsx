import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg w-full">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          techoo ai
        </h1>
        <p className="text-center text-gray-400 mt-1">
          Instantly try on new styles with the power of generative AI.
        </p>
      </div>
    </header>
  );
};