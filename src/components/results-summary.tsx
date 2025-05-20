"use client";

import { useMutation } from '@tanstack/react-query';
import { summarizeFormResults, type SummarizeFormResultsInput } from '@/ai/flows/summarize-form-results';
import type { ParseQuestionnaireOutput } from '@/ai/flows/parse-questionnaire';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, Share2, AlertCircle, Sparkles, FileCheck2, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';

type ResultsDisplayProps = {
  formSchema: ParseQuestionnaireOutput;
  formData: Record<string, unknown>;
};

export default function ResultsDisplay({ formSchema, formData }: ResultsDisplayProps) {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (input: SummarizeFormResultsInput) => summarizeFormResults(input),
    onError: (error) => {
      toast({
        title: "AI Summary Failed",
        description: error.message || "Could not generate summary.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (formSchema && formData) {
      mutation.mutate({
        formSchema: JSON.stringify(formSchema),
        formResults: JSON.stringify(formData),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSchema, formData]); // mutation can be added if its identity is stable

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({ title: `${type} Copied!`, description: `${type} copied to clipboard.` });
      })
      .catch(err => {
        toast({ title: `Copy Failed`, description: `Could not copy ${type.toLowerCase()}.`, variant: "destructive" });
        console.error(`Could not copy ${type.toLowerCase()}: `, err);
      });
  };

  const shareableResultsLink = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileCheck2 className="h-7 w-7 text-primary" />
            Form Submission Successful!
          </CardTitle>
          <CardDescription>
            Thank you for submitting the form: <span className="font-semibold">{formSchema.formTitle}</span>.
          </CardDescription>
        </CardHeader>
      </Card>

      {formData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              Your Responses
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto bg-muted/30 p-4 rounded-md">
            <pre className="text-sm whitespace-pre-wrap break-all">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-accent" />
            AI Powered Summary
          </CardTitle>
          <CardDescription>
            Here&apos;s an AI-generated summary of the submitted results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mutation.isPending && (
            <div className="flex items-center justify-center py-8">
              <Sparkles className="mr-2 h-5 w-5 animate-pulse text-primary" />
              <p>Generating summary...</p>
            </div>
          )}
          {mutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Summary Error</AlertTitle>
              <AlertDescription>{mutation.error?.message || "An unknown error occurred."}</AlertDescription>
            </Alert>
          )}
          {mutation.isSuccess && mutation.data && (
            <div className="prose prose-sm max-w-none p-4 bg-accent/10 rounded-md">
              <p>{mutation.data.summary}</p>
            </div>
          )}
        </CardContent>
        {mutation.isSuccess && mutation.data && (
          <CardFooter className="border-t pt-4">
             <Button
              variant="outline"
              onClick={() => handleCopyToClipboard(mutation.data?.summary || '', 'Summary')}
              className="w-full"
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Summary
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Share2 className="h-6 w-6 text-primary" />
             Share These Results
           </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">You can share a link to this results page:</p>
          <Input type="text" readOnly value={shareableResultsLink} className="mb-2"/>
          <Button
            onClick={() => handleCopyToClipboard(shareableResultsLink, 'Results Link')}
            className="w-full"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Results Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
