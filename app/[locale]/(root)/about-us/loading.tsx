import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-4xl h-64 bg-gray-200 animate-pulse rounded-lg shadow-sm"></div>
      <div className="flex flex-col items-center space-y-6 mt-8">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-4 w-96 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    </div>
  );
};

export default Loading;
