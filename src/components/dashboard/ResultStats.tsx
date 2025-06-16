import React from 'react';
import { CardDescription } from '@/components/ui/card'; // Assuming CardDescription is used for stats

interface ResultStatsProps {
  average?: number;
  min?: number;
  max?: number;
  sum?: number;
}

const ResultStats: React.FC<ResultStatsProps> = ({ average, min, max, sum }) => {
  return (
    <div className="grid grid-cols-2 gap-4_p-4">
      {average !== undefined && (
        <div className="flex flex-col_items-center_justify-center_p-2_border_rounded-lg">
          <CardDescription className="text-xs_text-muted-foreground">Average</CardDescription>
          <p className="text-lg_font-semibold">{average.toFixed(2)}</p>
        </div>
      )}
      {min !== undefined && (
        <div className="flex flex-col_items-center_justify-center_p-2_border_rounded-lg">
          <CardDescription className="text-xs_text-muted-foreground">Min</CardDescription>
          <p className="text-lg_font-semibold">{min}</p>
        </div>
      )}
      {max !== undefined && (
        <div className="flex flex-col_items-center_justify-center_p-2_border_rounded-lg">
          <CardDescription className="text-xs_text-muted-foreground">Max</CardDescription>
          <p className="text-lg_font-semibold">{max}</p>
        </div>
      )}
      {sum !== undefined && (
        <div className="flex flex-col_items-center_justify-center_p-2_border_rounded-lg">
          <CardDescription className="text-xs_text-muted-foreground">Total Sum</CardDescription>
          <p className="text-lg_font-semibold">{sum}</p>
        </div>
      )}
    </div>
  );
};

export default ResultStats;
