import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming ScrollArea is used
import { CardDescription } from '@/components/ui/card'; // Assuming CardDescription is used

interface TextResponsesProps {
  responses: Array<{ value: string; count: number }>; // More specific type based on actual data structure
  uniqueResponses?: number; // Optional: if you want to display the count of unique responses
}

const TextResponses: React.FC<TextResponsesProps> = ({ responses, uniqueResponses }) => {
  return (
    <div className="p-4">
      {uniqueResponses !== undefined && (
        <CardDescription className="mb-2">
          Unique Responses: {uniqueResponses}
        </CardDescription>
      )}
      <ScrollArea className="h-40_border_rounded-md_p-2">
        {responses.map((response, index) => (
          <div key={index} className="text-sm_mb-1">
            ({response.count}) {response.value}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default TextResponses;
