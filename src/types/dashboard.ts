import type { DataSchema } from '@/ai/flows/parse-questionnaire';

// Define the structure of the JSON file uploaded by investigators
export type UploadedJsonData = {
    id: string; // Unique ID for each submission
    formTitle: string;
    formDescription?: string;
    submittedAt: string; // ISO string
    dataSchema: DataSchema;
    formData: Record<string, unknown>;
  };
  
export interface AggregatedResult {
    count: number; // Total submissions for this field
    label: string;
    analysisHint?: string;
    type?: string;
    options?: string[];
    distribution?: Record<string, number>; // For categorical, boolean, checkbox group options
    average?: number; // For numerical data
    min?: number;
    max?: number;
    sum?: number;
    responses?: unknown[]; // For text data or raw view
    uniqueResponses?: number;
} 