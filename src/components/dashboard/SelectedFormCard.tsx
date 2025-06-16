import { Card, CardContent } from '@/components/ui/card'; // CardDescription, CardHeader, CardTitle removed
import { AiAnalysisSection } from './AiAnalysisSection'; // Child component
import SelectedFormCardHeader from './SelectedFormCardHeader'; // Added import
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
      <SelectedFormCardHeader
        selectedFormTitle={selectedFormTitle}
        filteredSubmissionsCount={filteredSubmissionsCount}
        currentDataSchema={currentDataSchema}
      />
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