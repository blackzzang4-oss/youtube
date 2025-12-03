import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Button from './components/Button';
import AnalysisCard from './components/AnalysisCard';
import { analyzeScriptContent, recommendTopics, generateNewScript } from './services/geminiService';
import { ScriptAnalysis, TopicRecommendation, AppState } from './types';
import { ArrowRightIcon, SparklesIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysis, setAnalysis] = useState<ScriptAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<TopicRecommendation[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>('');
  
  // Refs for auto-scrolling
  const analysisRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setAppState(AppState.ANALYZING);
    try {
      const result = await analyzeScriptContent(inputText);
      setAnalysis(result);
      setAppState(AppState.IDLE);
      // Reset subsequent steps
      setRecommendations([]);
      setGeneratedScript('');
      
      // Slight delay for DOM update
      setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      console.error(e);
      setAppState(AppState.ERROR);
    }
  };

  const handleGetRecommendations = async () => {
    if (!analysis) return;
    setAppState(AppState.RECOMMENDING);
    try {
      const result = await recommendTopics(analysis);
      setRecommendations(result);
      setAppState(AppState.IDLE);
      setTimeout(() => recommendRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      console.error(e);
      setAppState(AppState.ERROR);
    }
  };

  const handleGenerateScript = async (topic: string) => {
    if (!analysis) return;
    setSelectedTopic(topic);
    setAppState(AppState.GENERATING);
    try {
      const script = await generateNewScript(topic, analysis.tone);
      setGeneratedScript(script);
      setAppState(AppState.IDLE);
      setTimeout(() => scriptRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      console.error(e);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setInputText('');
    setAnalysis(null);
    setRecommendations([]);
    setGeneratedScript('');
    setSelectedTopic(null);
    setAppState(AppState.IDLE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-blue-500/30">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* Section 1: Input */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <DocumentTextIcon className="w-7 h-7 text-blue-500" />
              1. 기존 대본/주제 입력
            </h2>
            <p className="text-slate-400">분석하고 싶은 기존 유튜브 대본이나, 평소 다루는 영상 주제를 자세히 적어주세요.</p>
          </div>
          
          <div className="relative">
            <textarea
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded-2xl p-6 text-lg leading-relaxed text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-inner"
              placeholder="예: 안녕하세요, 오늘은 아이폰 15 프로 리뷰를 해보겠습니다. 이번 모델의 가장 큰 특징은 티타늄 프레임인데요..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            {inputText.length > 0 && (
              <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                {inputText.length}자 입력됨
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleAnalyze} 
              disabled={!inputText || appState !== AppState.IDLE}
              className="w-full md:w-auto"
            >
              {appState === AppState.ANALYZING ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  AI 분석 시작하기 <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Section 2: Analysis Result */}
        {analysis && (
          <section ref={analysisRef} className="space-y-6 pt-8 border-t border-slate-800">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <SparklesIcon className="w-7 h-7 text-purple-500" />
                2. AI 분석 결과
              </h2>
            </div>
            
            <AnalysisCard analysis={analysis} />

            <div className="flex justify-center pt-8">
              <Button 
                onClick={handleGetRecommendations}
                variant="secondary"
                disabled={appState !== AppState.IDLE}
                className="w-full md:w-auto"
              >
                {appState === AppState.RECOMMENDING ? '주제 뽑는 중...' : '🔥 다음 단계: 조회수 터지는 주제 추천받기'}
              </Button>
            </div>
          </section>
        )}

        {/* Section 3: Topic Recommendations */}
        {recommendations.length > 0 && (
          <section ref={recommendRef} className="space-y-6 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <SparklesIcon className="w-7 h-7 text-yellow-500" />
              3. 추천 주제 선택
            </h2>
            <p className="text-slate-400">가장 마음에 드는 주제를 선택하면, AI가 전체 대본을 써줍니다.</p>

            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((topic, idx) => (
                <div 
                  key={idx}
                  onClick={() => appState === AppState.IDLE && handleGenerateScript(topic.title)}
                  className={`
                    group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden
                    ${selectedTopic === topic.title 
                      ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800'}
                  `}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${selectedTopic === topic.title ? 'text-blue-400' : 'text-white group-hover:text-blue-300'}`}>
                        {topic.title}
                      </h3>
                      <p className="text-slate-400 text-sm">{topic.reason}</p>
                    </div>
                    {appState === AppState.GENERATING && selectedTopic === topic.title ? (
                      <ArrowPathIcon className="w-6 h-6 text-blue-500 animate-spin" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <ArrowRightIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Generated Script */}
        {generatedScript && (
          <section ref={scriptRef} className="space-y-6 pt-8 border-t border-slate-800 pb-20">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <DocumentTextIcon className="w-7 h-7 text-green-500" />
                4. 완성된 대본
              </h2>
              <Button variant="outline" onClick={handleReset} className="text-sm px-4 py-2">
                새로 만들기
              </Button>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <article className="prose prose-invert prose-lg max-w-none prose-headings:text-blue-300 prose-strong:text-white prose-p:text-slate-300">
                <ReactMarkdown>{generatedScript}</ReactMarkdown>
              </article>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigator.clipboard.writeText(generatedScript)}>
                대본 복사하기
              </Button>
            </div>
          </section>
        )}

        {/* Error State */}
        {appState === AppState.ERROR && (
          <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
            <span className="font-bold">오류 발생!</span>
            <span>잠시 후 다시 시도해주세요.</span>
            <button onClick={() => setAppState(AppState.IDLE)} className="ml-2 underline">닫기</button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;