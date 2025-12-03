import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScriptAnalysis, TopicRecommendation } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Analysis Service ---
export const analyzeScriptContent = async (text: string): Promise<ScriptAnalysis> => {
  const ai = getAiClient();
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "대본의 핵심 내용을 1-2문장으로 요약" },
      tone: { type: Type.STRING, description: "대본의 전반적인 분위기와 어조 (예: 유머러스함, 진지함 등)" },
      targetAudience: { type: Type.STRING, description: "이 영상이 타겟팅하는 주 시청자층" },
      hookPoints: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "시청자의 이탈을 막는 흥미 유발 요소 3가지"
      },
      improvementSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "대본을 더 발전시키기 위한 구체적인 조언 3가지"
      }
    },
    required: ["summary", "tone", "targetAudience", "hookPoints", "improvementSuggestions"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `다음 텍스트는 유튜브 영상의 대본 또는 관련 내용입니다. 이를 분석하여 한국어로 결과를 반환해주세요.\n\n[입력 텍스트]:\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "당신은 100만 구독자를 보유한 유튜브 전문 PD입니다. 예리하고 통찰력 있는 분석을 제공하세요."
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("분석 결과를 받지 못했습니다.");
    
    return JSON.parse(jsonText) as ScriptAnalysis;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

// --- Recommendation Service ---
export const recommendTopics = async (analysis: ScriptAnalysis): Promise<TopicRecommendation[]> => {
  const ai = getAiClient();

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "추천 영상 제목 (클릭을 유도하는 썸네일용 제목)" },
        reason: { type: Type.STRING, description: "이 주제를 추천하는 이유" }
      },
      required: ["title", "reason"]
    }
  };

  try {
    const prompt = `
    이전 분석 데이터를 바탕으로 해당 채널의 시청자가 좋아할 만한 새로운 영상 주제 4가지를 추천해주세요.
    
    [분석 데이터]:
    - 타겟 시청자: ${analysis.targetAudience}
    - 현재 톤앤매너: ${analysis.tone}
    - 개선점: ${analysis.improvementSuggestions.join(', ')}
    
    최신 트렌드를 반영하여 조회수가 잘 나올만한 주제로 선정해주세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("추천 결과를 받지 못했습니다.");

    return JSON.parse(jsonText) as TopicRecommendation[];
  } catch (error) {
    console.error("Recommendation Error:", error);
    throw error;
  }
};

// --- Generation Service ---
export const generateNewScript = async (topicTitle: string, analysisTone: string): Promise<string> => {
  const ai = getAiClient();

  try {
    const prompt = `
    다음 주제로 유튜브 영상 대본을 작성해주세요.
    
    [주제]: ${topicTitle}
    [톤앤매너]: ${analysisTone}
    
    [요청사항]:
    1. 오프닝 (Hook): 5초 안에 시청자를 사로잡을 강력한 도입부
    2. 본론 (Body): 논리적이고 흥미로운 전개 (소제목 사용)
    3. 결론 (Outro): 핵심 요약 및 구독/좋아요 유도
    4. 마크다운 형식으로 출력해주세요. 가독성 있게 작성하세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // No JSON schema, we want raw markdown text
        thinkingConfig: { thinkingBudget: 0 } // Flash model usually doesn't need thinking, keep 0 for speed
      }
    });

    return response.text || "대본 생성에 실패했습니다.";
  } catch (error) {
    console.error("Generation Error:", error);
    throw error;
  }
};
