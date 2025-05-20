"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Keep useRouter for potential navigation
import ResultsDisplay from '@/components/results-summary';
import { decodeObjectFromUrl } from '@/lib/url-utils';
import type { ParseQuestionnaireOutput } from '@/ai/flows/parse-questionnaire';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const encodedSchema = searchParams.get('schema');
  const encodedData = searchParams.get('data');

  const formSchema = decodeObjectFromUrl<ParseQuestionnaireOutput>(encodedSchema);
  const formData = decodeObjectFromUrl<unknown>(encodedData);

  // This page is now primarily for results that were submitted to a server for AI summary.
  // If schema and data are not present, it implies direct access or incorrect link for this specific flow.
  if (!formSchema || !formData) {
    return (
       <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6 text-primary" /> Server-Side AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">This page displays AI-powered summaries for form results that have been submitted to a server.</p>
          <p>If you are looking to view data from a downloaded HTML form, please use the Investigator Dashboard.</p>
           <Alert variant="default" className="bg-secondary/50">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <AlertTitle>Missing Data for Server Summary</AlertTitle>
            <AlertDescription>
              To view a server-generated AI summary, ensure you are accessing this page via a link that includes the necessary form schema and data parameters, typically after a server-side submission process.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/')} className="w-full mt-4">
            Back to Create Form
          </Button>
          <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full mt-2">
            Go to Investigator Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // If schema and data are present, proceed to show ResultsDisplay (which calls the AI summary flow)
  return <ResultsDisplay formSchema={formSchema} formData={formData} />;
}

export default function ResultsPage() {
   return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading results...</span></div>}>
          <ResultsPageContent />
        </Suspense>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FormWise. All rights reserved.
      </footer>
    </>
  );
}