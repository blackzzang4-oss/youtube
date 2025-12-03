import React from 'react';
import { VideoCameraIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-900/20">
          <VideoCameraIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            유튜브 <span className="text-red-500">크리에이터</span> AI
          </h1>
          <p className="text-xs text-slate-400">대본 분석부터 생성까지 한 번에</p>
        </div>
      </div>
    </header>
  );
};

export default Header;