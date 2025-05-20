"use client";

import { useState, type ChangeEvent } from 'react';
// useRouter is removed as we are not navigating to /form anymore
import { useMutation } from '@tanstack/react-query';
import { parseQuestionnaire, type ParseQuestionnaireOutput } from '@/ai/flows/parse-questionnaire';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileJson, AlertCircle, Sparkles, Download, LayoutDashboard } from 'lucide-react'; // Added Download icon
import { useToast } from '@/hooks/use-toast';
// encodeObjectForUrl is removed as we are not passing schema via URL
import Link from 'next/link';
import { generateInteractiveHtmlForm } from '@/lib/html-form-generator'; // Import the new generator

export default function FormUploader() {
  const [file, setFile] = useState<File | null>(null);
  // parsedFormSchema is still useful to pass to generateInteractiveHtmlForm
  const [parsedFormSchema, setParsedFormSchema] = useState<ParseQuestionnaireOutput | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (dataUri: string) => {
      return parseQuestionnaire({ questionnaireDataUri: dataUri });
    },
    onSuccess: (data) => {
      setParsedFormSchema(data);
      toast({
        title: "Questionnaire Parsed!",
        description: "Your interactive HTML form is ready to be downloaded.",
        variant: "default",
      });
      // Automatically trigger download after successful parsing
      handleDownloadHtmlForm(data);
    },
    onError: (error) => {
      console.error("Parsing error:", error);
      toast({
        title: "Parsing Failed",
        description: error.message || "Could not parse the questionnaire. Please try again.",
        variant: "destructive",
      });
      setParsedFormSchema(null);
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setParsedFormSchema(null); // Reset previous results
    }
  };

  const handleParse = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a PDF or text file.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUri = reader.result as string;
      mutation.mutate(dataUri);
    };
    reader.onerror = (error) => {
      console.error("File reading error:", error);
      toast({ title: "File Read Error", description: "Could not read the selected file.", variant: "destructive" });
    };
  };

  const handleDownloadHtmlForm = (schema: ParseQuestionnaireOutput | null = parsedFormSchema) => {
    if (!schema) {
      toast({ title: "No Form Schema", description: "Cannot download form, schema not available.", variant: "destructive" });
      return;
    }
    try {
      const htmlContent = generateInteractiveHtmlForm(schema);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${schema.formTitle.replace(/\s+/g, '_') || 'form'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "HTML Form Downloaded", description: `Started download for ${a.download}` });
    } catch (error: unknown) {
      console.error("Error generating or downloading HTML form:", error);
      toast({ title: "Download Error", description: error instanceof Error ? error.message : "Could not download the HTML form.", variant: "destructive" });
    }
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <FileJson className="h-7 w-7 text-primary" />
          Create Your Form
        </CardTitle>
        <CardDescription>
          Upload a PDF or text file of your questionnaire. Our AI will transform it into a downloadable, interactive HTML form.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="file-upload" className="text-sm font-medium">Questionnaire File (.pdf, .txt)</label>
          <Input id="file-upload" type="file" accept=".pdf,.txt" onChange={handleFileChange} className="file:text-sm file:font-medium" />
        </div>
        
        {mutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Parsing Error</AlertTitle>
            <AlertDescription>{mutation.error?.message || "An unknown error occurred."}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button onClick={handleParse} disabled={!file || mutation.isPending} className="w-full sm:w-auto">
          {mutation.isPending ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Parsing & Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Parse & Download Form
            </>
          )}
        </Button>
        {file && !mutation.isPending && <span className="text-sm text-muted-foreground">Selected: {file.name}</span>}
      </CardFooter>

      {parsedFormSchema && !mutation.isPending && (
        <CardContent className="mt-6 border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Form Processed!</h3>
          <p className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Title:</span> {parsedFormSchema.formTitle}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-medium">Description:</span> {parsedFormSchema.formDescription}
          </p>
          <Button variant="outline" onClick={() => handleDownloadHtmlForm()} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Interactive HTML Form Again
          </Button>
        </CardContent>
      )}
      <CardContent className="mt-4 border-t pt-6">
         <Link href="/dashboard" passHref legacyBehavior>
            <Button variant="secondary" className="w-full">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to Investigator Dashboard
            </Button>
          </Link>
      </CardContent>
    </Card>
  );
}
