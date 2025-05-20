import { Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCallback, useState, useEffect, memo } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { SummarizeFormResultsInput } from '@/ai/flows/summarize-form-results';

// Create a debounced textarea component to improve performance
const DebouncedTextarea = memo(({
  value,
  onChange,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the onChange handler
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onChange, value]);

  return (
    <Textarea
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      {...props}
    />
  );
});

DebouncedTextarea.displayName = 'DebouncedTextarea';

interface AiAnalysisSectionProps {
  customAiInstructions: string;
  onCustomAiInstructionsChange: (value: string) => void;
  handleAiAnalysis: () => void;
  aiSummarizeMutation: UseMutationResult<any, Error, SummarizeFormResultsInput, unknown>;
  aiSummary: string | null;
  formSubmissionsCount: number;
}

export function AiAnalysisSection({
  customAiInstructions,
  onCustomAiInstructionsChange,
  handleAiAnalysis,
  aiSummarizeMutation,
  aiSummary,
  formSubmissionsCount,
}: AiAnalysisSectionProps) {
  // Memoize the handlers
  const handleButtonClick = useCallback(() => {
    // Use requestAnimationFrame to defer the heavy calculation
    requestAnimationFrame(() => {
      handleAiAnalysis();
    });
  }, [handleAiAnalysis]);

  return (
    <>
      <div className="space-y-3 bg-muted/20 p-4 rounded-lg border border-border/40">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-md bg-primary/10 text-primary"><Brain className="h-4 w-4" /></span>
          <Label htmlFor="custom-ai-instructions" className="font-medium">AI Analysis Instructions (Optional)</Label>
        </div>
        <DebouncedTextarea
          id="custom-ai-instructions"
          placeholder="For example: focus on answers from users under 25, or compare the answers to question X and Y."
          value={customAiInstructions}
          onChange={onCustomAiInstructionsChange}
          className="min-h-[80px] border-border/60 focus-visible:ring-primary/30"
        />
        <Button
          onClick={handleButtonClick}
          disabled={aiSummarizeMutation.isPending || formSubmissionsCount === 0}
          className="w-full sm:w-auto bg-primary/90 hover:bg-primary transition-colors duration-200"
        >
          <Brain className="mr-2 h-4 w-4" />
          {aiSummarizeMutation.isPending ? "Analyzing..." : "Use AI to analyze data"}
        </Button>
      </div>

      {aiSummarizeMutation.isSuccess && aiSummary && (
        <Card className="bg-accent/10 border-accent/20 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-accent/20 text-accent"><Sparkles className="h-4 w-4" /></span>
              AI Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none pt-0">{aiSummary}</CardContent>
        </Card>
      )}
      {aiSummarizeMutation.isPending && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[85%]" />
        </div>
      )}
    </>
  );
} 