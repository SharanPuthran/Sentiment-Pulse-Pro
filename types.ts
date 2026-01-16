export interface SentimentDataPoint {
  date: string;
  score: number; // -1 to 1
  label: string;
}

export interface WordCloudItem {
  text: string;
  value: number;
  sentiment: 'praise' | 'complaint';
}

export interface ActionableArea {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface CategoryData {
  name: string;
  sentimentScore: number;
  summary: string;
  keywords: string[];
}

export interface ReviewEntry {
  id: string;
  text: string;
  source: 'twitter' | 'google' | 'yelp' | 'reddit' | 'facebook' | 'linkedin';
  timestamp: Date;
}

export interface DashboardReport {
  executiveSummary: string;
  actionableAreas: ActionableArea[];
  sentimentTrend: SentimentDataPoint[];
  wordCloud: WordCloudItem[];
  categories: CategoryData[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'thought';
  text: string;
}

export type DataSource = 'manual' | 'yelp' | 'google' | 'twitter' | 'reddit' | 'facebook' | 'linkedin';