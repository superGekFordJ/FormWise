import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

interface AiSummaryDisplayProps {
  isSuccess: boolean;
  isPending: boolean;
  summary: string | null;
}

const AiSummaryDisplay: React.FC<AiSummaryDisplayProps> = ({ isSuccess, isPending, summary }) => {
  if (isPending) {
    return (
      <Card className="mt-6 border border-border/40 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (isSuccess && summary) {
    return (
      <Card className="mt-6 border border-purple-500/30 shadow-lg bg-gradient-to-br from-purple-50/10 via-transparent to-transparent dark:from-purple-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
            {summary}
          </p>
        </CardContent>
      </Card>
    );
  }

  return null; // Or some fallback UI if needed when not pending and no successful summary
};

export default AiSummaryDisplay;
