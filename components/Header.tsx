import React from 'react';
import { VideoCameraIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
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
        <button
          onClick={onSettingsClick}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="설정"
        >
          <Cog6ToothIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;