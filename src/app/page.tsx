import FormUploader from '@/components/form-uploader';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl flex items-center justify-center gap-3">
              FormWise <Sparkles className="h-10 w-10 text-accent" />
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Transform your documents into interactive online forms effortlessly with the power of AI.
              Upload your questionnaire and let FormWise handle the rest.
            </p>
          </div>
          <FormUploader />

          <Card className="w-full max-w-2xl mx-auto mt-12 bg-secondary/50">
            <CardHeader>
              <CardTitle>How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-secondary-foreground">
              <p>1. <span className="font-semibold">Upload:</span> Select your questionnaire file (PDF or TXT).</p>
              <p>2. <span className="font-semibold">AI Parsing:</span> Our intelligent system analyzes the document and structures it into form fields.</p>
              <p>3. <span className="font-semibold">Interact:</span> Fill out your newly created form directly in your browser.</p>
              <p>4. <span className="font-semibold">Analyze & Share:</span> Submit your responses and get an AI-powered summary, then share your form or results.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FormWise. All rights reserved.
      </footer>
    </>
  );
}
