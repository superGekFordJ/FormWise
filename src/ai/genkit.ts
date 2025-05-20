import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ParsingAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash-preview-04-17',
});

export const SummaryAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash-preview-04-17',
});