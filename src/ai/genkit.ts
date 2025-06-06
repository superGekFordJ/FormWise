import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ParsingAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash-preview-05-20',
});

export const SummaryAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash-preview-05-20',
});