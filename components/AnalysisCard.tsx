import React from 'react';
import { ScriptAnalysis } from '../types';
import { ChartBarIcon, UserGroupIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface Props {
  analysis: ScriptAnalysis;
}

const AnalysisCard: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5" />
          핵심 요약
        </h3>
        <p className="text-slate-200 leading-relaxed text-lg">{analysis.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">톤앤매너</h3>
          <p className="text-white font-medium text-lg">{analysis.tone}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <UserGroupIcon className="w-4 h-4" /> 타겟 시청자
          </h3>
          <p className="text-white font-medium text-lg">{analysis.targetAudience}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-green-400 mb-4">✨ 후킹 포인트</h3>
          <ul className="space-y-3">
            {analysis.hookPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                <span className="text-slate-200">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
            <LightBulbIcon className="w-5 h-5" />
            개선 제안
          </h3>
          <ul className="space-y-3">
            {analysis.improvementSuggestions.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                <span className="text-slate-200">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;