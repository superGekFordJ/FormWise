import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AiAnalysisSection } from './AiAnalysisSection'; // Child component
import type { UseMutationResult } from '@tanstack/react-query';
import type { SummarizeFormResultsInput } from '@/ai/flows/summarize-form-results';
import type { DataSchema } from '@/ai/flows/parse-questionnaire';

interface SelectedFormCardProps {
  selectedFormTitle: string;
  filteredSubmissionsCount: number;
  currentDataSchema: DataSchema;
  customAiInstructions: string;
  onCustomAiInstructionsChange: (value: string) => void;
  handleAiAnalysis: () => void;
  aiSummarizeMutation: UseMutationResult<any, Error, SummarizeFormResultsInput, unknown>;
  aiSummary: string | null;
}

export function SelectedFormCard({
  selectedFormTitle,
  filteredSubmissionsCount,
  currentDataSchema,
  customAiInstructions,
  onCustomAiInstructionsChange,
  handleAiAnalysis,
  aiSummarizeMutation,
  aiSummary,
}: SelectedFormCardProps) {
  return (
    <Card className="shadow-xl border border-border/40 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
        <CardTitle className="text-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </span>
            <span>{selectedFormTitle}</span>
          </div>
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {filteredSubmissionsCount} {filteredSubmissionsCount === 1 ? 'submission' : 'submissions'}
          </span>
          {currentDataSchema && (
            <span className="text-xs text-muted-foreground">• Data Schema Version: {currentDataSchema.schemaVersion}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <AiAnalysisSection
          customAiInstructions={customAiInstructions}
          onCustomAiInstructionsChange={onCustomAiInstructionsChange}
          handleAiAnalysis={handleAiAnalysis}
          aiSummarizeMutation={aiSummarizeMutation}
          aiSummary={aiSummary}
          formSubmissionsCount={filteredSubmissionsCount}
        />
      </CardContent>
    </Card>
  );
} 