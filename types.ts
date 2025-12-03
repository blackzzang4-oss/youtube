export interface ScriptAnalysis {
  summary: string;
  tone: string;
  targetAudience: string;
  hookPoints: string[];
  improvementSuggestions: string[];
}

export interface TopicRecommendation {
  title: string;
  reason: string;
}

export interface GeneratedScript {
  title: string;
  content: string; // Markdown formatted
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RECOMMENDING = 'RECOMMENDING',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR'
}