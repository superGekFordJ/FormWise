import { memo, useState, useCallback, useMemo } from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import type { UploadedJsonData } from '@/types/dashboard';
import type { DataSchema } from '@/ai/flows/parse-questionnaire';

interface RawSubmissionsTableProps {
  filteredSubmissions: UploadedJsonData[];
  currentDataSchema: DataSchema | null;
}

// Create a virtualized table row renderer to improve performance
const TableRowRenderer = memo(({ 
  submission, 
  index, 
  fields, 
  fieldsLength 
}: { 
  submission: UploadedJsonData; 
  index: number; 
  fields: DataSchema['fields']; 
  fieldsLength: number;
}) => {
  return (
    <TableRow className={index % 2 === 0 ? 'bg-muted/5' : 'bg-background hover:bg-muted/10'}>
      <TableCell className="font-medium truncate max-w-[100px]">
        <span className="inline-flex items-center justify-center rounded-full bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
          {submission.id.split('_').pop()}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">
          {new Date(submission.submittedAt).toLocaleDateString()}
        </span>
        <span className="block text-xs">
          {new Date(submission.submittedAt).toLocaleTimeString()}
        </span>
      </TableCell>
      {fields.slice(0, 4).map(f => {
        const value = submission.formData[f.id];
        const isEmpty = value === null || value === undefined || value === '';
        return (
          <TableCell key={f.id} className="truncate max-w-[150px]">
            {isEmpty ? (
              <span className="text-xs italic text-muted-foreground">(Empty)</span>
            ) : typeof value === 'boolean' ? (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${value ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                {value ? 'Yes' : 'No'}
              </span>
            ) : (
              String(value)
            )}
          </TableCell>
        );
      })}
      {fieldsLength > 4 &&
        <TableCell className="text-xs text-muted-foreground italic">
          plus {fieldsLength - 4} more fields
        </TableCell>
      }
    </TableRow>
  );
});

TableRowRenderer.displayName = 'TableRowRenderer';

export const RawSubmissionsTable = memo(function RawSubmissionsTable({ 
  filteredSubmissions, 
  currentDataSchema 
}: RawSubmissionsTableProps) {
  // Set a page size limit to improve rendering performance
  const PAGE_SIZE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  if (!currentDataSchema) return null;

  // Calculate total pages
  const totalPages = Math.ceil(filteredSubmissions.length / PAGE_SIZE);
  
  // Get submissions for current page
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSubmissions.slice(start, start + PAGE_SIZE);
  }, [filteredSubmissions, currentPage]);

  // Memoize the header row
  const tableHeader = useMemo(() => (
    <TableHeader className="bg-muted/30 sticky top-0">
      <TableRow>
        <TableHead className="font-medium">Submission ID</TableHead>
        <TableHead className="font-medium">Submission Time</TableHead>
        {currentDataSchema.fields.slice(0, 4).map(f => 
          <TableHead key={f.id} className="truncate max-w-[150px] font-medium">{f.label}</TableHead>
        )}
        {currentDataSchema.fields.length > 4 && 
          <TableHead className="font-medium">More Fields...</TableHead>
        }
      </TableRow>
    </TableHeader>
  ), [currentDataSchema.fields]);

  // Create pagination controls
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  return (
    <Card className="mt-6 border border-border/40 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="p-1.5 rounded-md bg-primary/10 text-primary"><Users className="h-5 w-5" /></span>
          <CardTitle className="text-xl">Raw Submission Data</CardTitle>
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'record' : 'records'}
          </span>
        </CardTitle>
        <CardDescription>View all raw submission data records</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full border rounded-md">
          <Table>
            {tableHeader}
            <TableBody>
              {paginatedSubmissions.map((sub, index) => (
                <TableRowRenderer 
                  key={sub.id} 
                  submission={sub} 
                  index={index} 
                  fields={currentDataSchema.fields} 
                  fieldsLength={currentDataSchema.fields.length} 
                />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevPage} 
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextPage} 
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default RawSubmissionsTable; 