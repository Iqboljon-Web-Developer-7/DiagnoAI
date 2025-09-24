import React from "react";

const loading = () => {
  return (
    <div className="fixed z-50 inset-0 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-cyan-400 opacity-50 animate-ping"></div>
        <div className="absolute w-40 h-40 sm:w-64 sm:h-64 rounded-full border-4 border-purple-500 opacity-30 animate-pulse"></div>
        <div className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-cyan-300 opacity-20 animate-spin"></div>
        <span className="text-center text-xl sm:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          AI Diagnosis
        </span>
      </div>

      {/* loading dots */}
      <div className="mt-4 sm:mt-10 flex space-x-2">
        <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>
  );
};

export default loading;
