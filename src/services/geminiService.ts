import { GoogleGenAI } from "@google/genai";
import { Device } from "../types";
import { MOCK_DEVICES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "갤럭시 S24 시리즈, 역대급 판매량 기록 중",
    summary: "삼성전자의 최신 플래그십 갤럭시 S24 시리즈가 전 세계적으로 전작 대비 10% 이상 높은 예약 판매량을 기록하며 순항 중입니다.",
    url: "https://www.samsung.com/sec/smartphones/galaxy-s24-ultra/",
    source: "TechDaily"
  },
  {
    title: "아이폰 16, 베젤 더 얇아질까? 유출 정보 화제",
    summary: "하반기 출시 예정인 아이폰 16 시리즈에서 'BRS' 기술을 적용해 역대 가장 얇은 베젤을 구현할 것이라는 전망이 나왔습니다.",
    url: "https://www.apple.com/iphone/",
    source: "MobileReview"
  },
  {
    title: "스냅드래곤 8 4세대, 싱글코어 성능 3000점 돌파?",
    summary: "퀄컴의 차세대 칩셋 스냅드래곤 8 Gen 4의 벤치마크 점수가 유출되었습니다. 싱글코어 성능이 크게 향상된 것으로 보입니다.",
    url: "https://www.qualcomm.com/snapdragon",
    source: "ChipInsights"
  },
  {
    title: "중저가 스마트폰 시장, 5G 지원 모델 90% 상회",
    summary: "2024년 1분기 기준 전 세계 시장에 출시된 스마트폰 중 5G를 지원하는 비중이 90%를 넘어서며 기술 대중화가 가속화되고 있습니다.",
    url: "https://www.counterpointresearch.com/",
    source: "MarketMonitor"
  },
  {
    title: "AI 스마트폰 시대, 온디바이스 AI 경쟁 가열",
    summary: "구글, 삼성, 애플 등 주요 제조사들이 클라우드 연결 없이 기기 자체에서 구동되는 생성형 AI 기능 탑재에 박차를 가하고 있습니다.",
    url: "https://blog.google/products/android/",
    source: "FutureTech"
  }
];

const CACHE_KEY_NEWS = 'techspec_news_cache';
const CACHE_TIME_NEWS = 10 * 60 * 1000; // 10 minutes

export async function fetchSmartphoneNews(): Promise<NewsItem[]> {
  try {
    // Check cache first
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY_NEWS);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TIME_NEWS) {
          return data;
        }
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "최신 스마트폰 및 테크 뉴스 5개를 알려줘. 각 뉴스마다 제목, 요약, 출처, URL을 포함해서 JSON 배열 형식([{title: string, summary: string, source: string, url: string}])으로 대답해줘. 특히 'url'은 해당 기사의 개별 상세 페이지 전체 주소(Full URL)여야 하며, 홈페이지 메인 주소(예: nate.com, naver.com 등)여서는 안 돼. 기사의 상세 URL을 확실히 찾을 수 없는 항목은 제외하고, 유효한 기사로만 리스트를 구성해줘.",
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });

    const news = JSON.parse(response.text || "[]");
    
    if (Array.isArray(news) && news.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CACHE_KEY_NEWS, JSON.stringify({
          data: news,
          timestamp: Date.now()
        }));
      }
      return news;
    }
    
    return FALLBACK_NEWS;
  } catch (error: any) {
    console.error("Error fetching news:", error);
    return FALLBACK_NEWS;
  }
}

export async function searchDevices(filters: any): Promise<Device[]> {
  try {
    const brandStr = filters.brand && filters.brand !== '모든 브랜드' ? filters.brand : 'Any';
    const minDisplay = filters.minDisplay || 0;
    const maxDisplay = filters.maxDisplay || 10;
    const minBattery = filters.minBattery || 0;
    const maxBattery = filters.maxBattery || 10000;
    const minWeight = filters.minWeight || 0;
    const maxWeight = filters.maxWeight || 1000;
    const minPrice = filters.minPrice || 0;
    const maxPrice = filters.maxPrice || 5000;
    const minScore = filters.minScore || 0;

    const prompt = `Find up to 6 REAL currently available smartphones matching these criteria as closely as possible.
    STRICT REQUIREMENT: You MUST find at least 3-6 real models. If a perfect match for all numeric constraints isn't found, relax the constraints by up to 20% to find the best available devices.
    Return ONLY a JSON array of objects.

    Target Criteria:
    - Brand Preference: ${brandStr} (if 'Any', check all brands)
    - Year: 2022-2026
    - Screen Size Target: ${minDisplay} to ${maxDisplay} inches
    - Battery capacity Target: ${minBattery} to ${maxBattery} mAh
    - Weight Target: ${minWeight} to ${maxWeight} g
    - Price Target: $${minPrice} to $${maxPrice} USD
    - Performance Level Target: ${minScore}/100 (100 is ultra flagship, 50 is mid-range)

    JSON Object Structure:
    {
      "id": string (unique slug like 'iphone-15-pro'),
      "name": string (full model name),
      "brand": string,
      "year": number,
      "price": number (current market USD),
      "os": "iOS" | "Android",
      "display": string (e.g. "6.1\" Super Retina XDR"),
      "displaySize": number (e.g. 6.1),
      "battery": number (mAh),
      "weight": number (g),
      "chipset": string (e.g. "A17 Pro", "Snapdragon 8 Gen 3"),
      "imageUrl": string (high-quality direct image URL),
      "description": string (one sentence key selling point),
      "score": number (0-100 rating based on value/specs),
      "geekbench": { "single": number, "multi": number },
      "tags": string[] (e.g. ["Compact", "Fast Charging", "Telephoto"])
    }
    
    IMPORTANT: Do not return empty array if possible. Use the Search tool to find 2024-2025 models.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "[]";
    const devices = JSON.parse(text);
    if (Array.isArray(devices) && devices.length > 0) return devices;
    return MOCK_DEVICES;
  } catch (error: any) {
    console.error("Error searching devices:", error);
    // Return mock data if API limits are hit or other errors occur
    return MOCK_DEVICES;
  }
}
