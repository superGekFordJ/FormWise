import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { DataSchema } from '@/ai/flows/parse-questionnaire'; // Assuming this is the correct path

interface SelectedFormCardHeaderProps {
  selectedFormTitle: string;
  filteredSubmissionsCount: number;
  currentDataSchema: DataSchema | null;
}

const SelectedFormCardHeader: React.FC<SelectedFormCardHeaderProps> = ({
  selectedFormTitle,
  filteredSubmissionsCount,
  currentDataSchema,
}) => {
  return (
    <CardHeader className="border-b border-border/30 bg-muted/10 p-5">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
              </svg>
            </span>
            {selectedFormTitle || "No form selected"}
          </CardTitle>
          <CardDescription className="mt-1.5 text-sm text-muted-foreground">
            {currentDataSchema ?
              `Displaying analysis for ${filteredSubmissionsCount} out of ${currentDataSchema.total_submissions || 'N/A'} submissions. Schema: ${currentDataSchema.name} (v${currentDataSchema.version || 'N/A'})`
              :
              "No data schema loaded."
            }
          </CardDescription>
        </div>
        {/* Add any other elements like a settings button if needed in the future */}
      </div>
    </CardHeader>
  );
};

export default SelectedFormCardHeader;
