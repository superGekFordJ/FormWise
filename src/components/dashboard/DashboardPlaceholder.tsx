import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

interface DashboardPlaceholderProps {
  uniqueFormTitlesCount: number;
}

export function DashboardPlaceholder({ uniqueFormTitlesCount }: DashboardPlaceholderProps) {
  return (
    <Card className="w-full shadow-md border-dashed border-2 border-muted bg-muted/5 hover:bg-muted/10 transition-colors duration-300">
      <CardContent className="py-16 flex flex-col items-center justify-center text-center">
        <div className="p-6 rounded-full bg-primary/5 mb-6 animate-pulse">
          <Upload className="h-16 w-16 text-primary/70" />
        </div>
        <h3 className="text-2xl font-semibold text-muted-foreground mb-3">No form data available</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {uniqueFormTitlesCount > 0
            ? "Please select a form from the left sidebar to view its data analysis."
            : "Please upload JSON data files to start analyzing your form data. Uploaded data is stored locally and not sent to the server."}
        </p>
        {uniqueFormTitlesCount === 0 && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <label htmlFor="json-upload" className="cursor-pointer">
                <Upload className="h-4 w-4" />
                Select JSON files
              </label>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create a new form
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 