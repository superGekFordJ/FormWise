
'use server';

/**
 * @fileOverview Summarizes the results of a form submission to provide key insights.
 *
 * - summarizeFormResults - A function that takes form results and returns a summary.
 * - SummarizeFormResultsInput - The input type for the summarizeFormResults function.
 * - SummarizeFormResultsOutput - The return type for the summarizeFormResults function.
 */

import {SummaryAI} from '@/ai/genkit';
import {ToolSchema, z} from 'genkit';

const SummarizeFormResultsInputSchema = z.object({
  formResults: z
    .string()
    .describe('The form results as a stringified JSON object or an array of JSON objects (for multiple submissions).'),
  formSchema: z
    .string()
    .describe('The form schema as a stringified JSON object, including question types and analysis hints.'),
  customInstructions: z
    .string()
    .optional()
    .describe('Optional custom instructions for the AI summarization, provided by the user.'),
});
export type SummarizeFormResultsInput = z.infer<typeof SummarizeFormResultsInputSchema>;

const SummarizeFormResultsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the key trends and insights from the form results.'),
});
export type SummarizeFormResultsOutput = z.infer<typeof SummarizeFormResultsOutputSchema>;

export async function summarizeFormResults(input: SummarizeFormResultsInput): Promise<SummarizeFormResultsOutput> {
  return summarizeFormResultsFlow(input);
}

const summarizeFormResultsPrompt = SummaryAI.definePrompt({
  name: 'summarizeFormResultsPrompt',
  input: {
    schema: SummarizeFormResultsInputSchema,
  },
  output: {
    schema: SummarizeFormResultsOutputSchema,
  },
  config: {
    temperature: 0.4,
    topP: 0.85,
  },
  prompt: `You are an expert data analyst tasked with summarizing form results to identify key trends and insights.
You will be provided with a form schema and results from one or more submissions.
{{#if customInstructions}}
The user has provided the following specific instructions for this summary:
{{{customInstructions}}}
Please prioritize these instructions in your analysis and summary.
{{/if}}

Form Schema:
{{{formSchema}}}

Form Results (this might be a single JSON object for one submission, or an array of JSON objects for multiple submissions):
{{{formResults}}}

Provide a concise summary of the key trends and insights from the form results, keeping the user's instructions in mind if provided.
If multiple submissions are provided, aggregate the findings.
Focus on providing actionable intelligence based on the data provided.
Ensure that the summary is easily understandable by someone who may not have reviewed the individual form submissions.
Pay close attention to the question types and analysis hints in the schema provided.
For multiple choice questions, report on the distribution of answers.
For numerical questions, discuss averages, ranges, or significant clusters if apparent.
For open-ended text questions, try to identify common themes or sentiments.
Highlight any strong correlations or surprising findings.
Output in the form language of the questionnaire and plain text.
`,
});

const summarizeFormResultsFlow = SummaryAI.defineFlow(
  {
    name: 'summarizeFormResultsFlow',
    inputSchema: SummarizeFormResultsInputSchema,
    outputSchema: SummarizeFormResultsOutputSchema,
  },
  async input => {
    const {output} = await summarizeFormResultsPrompt(input);
    return output!;
  }
);

