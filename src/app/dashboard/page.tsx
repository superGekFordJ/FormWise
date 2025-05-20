"use client";

import { useState, type ChangeEvent, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { summarizeFormResults, type SummarizeFormResultsInput } from '@/ai/flows/summarize-form-results';
import { useToast } from '@/hooks/use-toast';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

// Import new refactored components
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardPlaceholder } from '@/components/dashboard/DashboardPlaceholder';
import { FormListSidebar } from '@/components/dashboard/FormListSidebar';
import { SelectedFormCard } from '@/components/dashboard/SelectedFormCard';
import { AggregatedResultCard } from '@/components/dashboard/AggregatedResultCard';
import { RawSubmissionsTable } from '@/components/dashboard/RawSubmissionsTable';
import { DeleteConfirmationDialog } from '@/components/dashboard/DeleteConfirmationDialog';

// Import types from the new types file
import type { UploadedJsonData, AggregatedResult } from '@/types/dashboard';

const LOCAL_STORAGE_KEY = 'formWiseSubmissions';

export default function InvestigatorDashboardPage() {
  const [allSubmissions, setAllSubmissions] = useState<UploadedJsonData[]>([]);
  const [selectedFormTitle, setSelectedFormTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formTitleToDelete, setFormTitleToDelete] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [customAiInstructions, setCustomAiInstructions] = useState<string>("");

  const { toast } = useToast();

  const aiSummarizeMutation = useMutation({
    mutationFn: (input: SummarizeFormResultsInput) => summarizeFormResults(input),
    onSuccess: (data) => {
      setAiSummary(data.summary);
      toast({ title: "AI Summary Generated", description: "The AI has analyzed the aggregated results." });
    },
    onError: (error) => {
      setAiSummary(null);
      toast({ title: "AI Summary Failed", description: error.message || "Could not generate summary.", variant: "destructive" });
    },
  });

  useEffect(() => {
    try {
      const storedSubmissions = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSubmissions) {
        setAllSubmissions(JSON.parse(storedSubmissions));
      }
    } catch (e) {
      console.error("Failed to load submissions from localStorage", e);
      setError("Could not load saved data. Storage might be corrupted.");
    }
  }, []);

  const uniqueFormTitles = useMemo(() => {
    const titles = new Set(allSubmissions.map(s => s.formTitle));
    return Array.from(titles);
  }, [allSubmissions]);

  const filteredSubmissions = useMemo(() => {
    if (!selectedFormTitle) return [];
    return allSubmissions.filter(s => s.formTitle === selectedFormTitle);
  }, [allSubmissions, selectedFormTitle]);

  const currentDataSchema = useMemo(() => {
    return filteredSubmissions.length > 0 ? filteredSubmissions[0].dataSchema : null;
  }, [filteredSubmissions]);

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setError(null);
      setFileName(files.length > 1 ? `${files.length} files selected` : files[0].name);

      const newSubmissionsPromises: Promise<UploadedJsonData | null>[] = Array.from(files).map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = e.target?.result;
              if (typeof content === 'string') {
                const parsedData = JSON.parse(content) as Omit<UploadedJsonData, 'id'>;
                if (parsedData.formTitle && parsedData.dataSchema && parsedData.dataSchema.fields && parsedData.formData && parsedData.submittedAt) {
                  resolve({
                    ...parsedData,
                    id: `${parsedData.formTitle}_${new Date(parsedData.submittedAt).getTime()}_${Math.random().toString(36).substr(2, 9)}`
                  });
                } else {
                  toast({ title: "Invalid JSON Structure", description: `File ${file.name} is missing required fields.`, variant: "destructive"});
                  resolve(null);
                }
              } else {
                 toast({ title: "File Read Error", description: `Could not read content of ${file.name}.`, variant: "destructive"});
                resolve(null);
              }
            } catch (err: unknown) {
              toast({ title: "JSON Parse Error", description: `Error parsing ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`, variant: "destructive"});
              resolve(null);
            }
          };
          reader.onerror = () => {
            toast({ title: "File Read Error", description: `Failed to read ${file.name}.`, variant: "destructive"});
            resolve(null);
          };
          reader.readAsText(file);
        });
      });

      const results = await Promise.all(newSubmissionsPromises);
      const successfulSubmissions = results.filter(sub => sub !== null) as UploadedJsonData[];

      if (successfulSubmissions.length > 0) {
        const updatedSubmissions = [...allSubmissions, ...successfulSubmissions];
        setAllSubmissions(updatedSubmissions);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSubmissions));
        toast({
          title: `${successfulSubmissions.length} File(s) Loaded`,
          description: `Successfully added data from ${successfulSubmissions.length} file(s).`,
        });
        if (!selectedFormTitle && successfulSubmissions.length > 0) {
          setSelectedFormTitle(successfulSubmissions[0].formTitle);
        }
      }
      
      const failedCount = files.length - successfulSubmissions.length;
      if (failedCount > 0) {
         setError(`${failedCount} file(s) could not be processed. Check toast notifications for details.`);
      }

      // Reset file input
      if (event.target) {
        event.target.value = ''; 
      }
    }
  }, [allSubmissions, selectedFormTitle, toast]);

  const handleDeleteFormTitleData = useCallback((formTitle: string) => {
    setFormTitleToDelete(formTitle);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (formTitleToDelete) {
      const updatedSubmissions = allSubmissions.filter(s => s.formTitle !== formTitleToDelete);
      setAllSubmissions(updatedSubmissions);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSubmissions));
      toast({ title: "Data Deleted", description: `All data for "${formTitleToDelete}" has been removed.` });
      if (selectedFormTitle === formTitleToDelete) {
        setSelectedFormTitle(null);
        setAiSummary(null);
        setCustomAiInstructions("");
      }
    }
    setShowDeleteConfirm(false);
    setFormTitleToDelete(null);
  }, [allSubmissions, formTitleToDelete, selectedFormTitle, toast]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setFormTitleToDelete(null);
  }, []);

  const getAggregatedResults = useCallback((): Record<string, AggregatedResult> => {
    if (!currentDataSchema || filteredSubmissions.length === 0) return {};

    const results: Record<string, AggregatedResult> = {};

    currentDataSchema.fields.forEach(fieldSchema => {
      const allValuesForField = filteredSubmissions.map(sub => sub.formData[fieldSchema.id]);
      const validValues = allValuesForField.filter(v => v !== null && v !== undefined && v !== '');

      results[fieldSchema.id] = {
        label: fieldSchema.label,
        count: validValues.length,
        analysisHint: fieldSchema.analysisHint,
        type: fieldSchema.type,
        options: fieldSchema.options,
        distribution: {},
        responses: [],
      };

      const currentResult = results[fieldSchema.id];

      if (fieldSchema.type === 'object_of_booleans' && fieldSchema.options) { // Checkbox group
        currentResult.distribution = fieldSchema.options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {});
        validValues.forEach(valueObj => {
          if (typeof valueObj === 'object' && valueObj !== null) {
            Object.entries(valueObj).forEach(([option, checked]) => {
              if (checked === true && currentResult.distribution![option] !== undefined) {
                currentResult.distribution![option]++;
              }
            });
          }
        });
      } else if (fieldSchema.options && (fieldSchema.analysisHint === 'categorical' || fieldSchema.type === 'radio' || fieldSchema.type === 'select')) { // Radio, Select
        currentResult.distribution = fieldSchema.options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {});
         validValues.forEach(val => {
          if (currentResult.distribution![String(val)] !== undefined) {
            currentResult.distribution![String(val)]++;
          } else {
            currentResult.distribution!['Other / Unlisted'] = (currentResult.distribution!['Other / Unlisted'] || 0) + 1;
          }
        });
      } else if (fieldSchema.type === 'number' || fieldSchema.analysisHint === 'numerical') {
        const numericValues = validValues.filter(v => typeof v === 'number' || (typeof v === 'string' && !isNaN(parseFloat(v)))).map(v => typeof v === 'string' ? parseFloat(v) : v as number);
        if (numericValues.length > 0) {
          currentResult.sum = numericValues.reduce((sum, val) => sum + val, 0);
          currentResult.average = currentResult.sum / numericValues.length;
          currentResult.min = Math.min(...numericValues);
          currentResult.max = Math.max(...numericValues);
        }
      } else if (fieldSchema.type === 'boolean' || (fieldSchema.type === 'checkbox' && !fieldSchema.options)) { // Single checkbox
        currentResult.distribution = { 'Yes': 0, 'No': 0 };
        validValues.forEach(val => {
          if (val === true) currentResult.distribution!['Yes']++;
          else if (val === false) currentResult.distribution!['No']++;
        });
      } else { // Text, textarea, date etc.
        currentResult.responses = validValues;
        currentResult.uniqueResponses = new Set(validValues).size;
      }
    });
    return results;
  }, [currentDataSchema, filteredSubmissions]);

  // Memoize the aggregated data to prevent recalculation on every render
  const aggregatedData = useMemo(() => getAggregatedResults(), [getAggregatedResults]);

  // Use useCallback for event handlers
  const handleCustomAiInstructionsChange = useCallback((value: string) => {
    setCustomAiInstructions(value);
  }, []);

  const handleAiAnalysis = useCallback(() => {
    if (!currentDataSchema || filteredSubmissions.length === 0) {
      toast({ title: "Not enough data", description: "No data available for AI analysis for the selected form.", variant: "destructive" });
      return;
    }
    setAiSummary(null); 
    
    const formResultsForAI = filteredSubmissions.map(sub => sub.formData);

    aiSummarizeMutation.mutate({
      formSchema: JSON.stringify(currentDataSchema),
      formResults: JSON.stringify(formResultsForAI),
      customInstructions: customAiInstructions || undefined,
    });
  }, [aiSummarizeMutation, currentDataSchema, customAiInstructions, filteredSubmissions, toast]);

  const handleSelectFormTitle = useCallback((title: string) => {
    setSelectedFormTitle(title);
    setAiSummary(null);
    setCustomAiInstructions("");
  }, []);

  // Memoize parts of the UI that can be expensive to render
  const aggregatedResultsGrid = useMemo(() => {
    return (
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {Object.entries(aggregatedData).map(([fieldId, result]) => (
          <AggregatedResultCard 
            key={fieldId}
            fieldId={fieldId} 
            result={result} 
          />
        ))}
      </div>
    );
  }, [aggregatedData]);

  return (
    <SidebarProvider defaultOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-2">
            <Input
                id="json-upload"
                type="file"
                accept=".json"
                multiple 
                onChange={handleFileChange}
                className="file:text-sm file:font-medium h-10"
              />
              {fileName && <p className="text-xs text-muted-foreground mt-1 truncate">Status: {fileName}</p>}
          </SidebarHeader>
          <SidebarContent className="p-2">
            <FormListSidebar
              uniqueFormTitles={uniqueFormTitles}
              selectedFormTitle={selectedFormTitle}
              onSelectFormTitle={handleSelectFormTitle}
              onDeleteFormTitleData={handleDeleteFormTitleData}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </SidebarContent>
          <SidebarFooter className="p-2 border-t">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="w-full">
                        <Link href="/">
                            <Home size={16} />
                            <span className="group-data-[collapsible=icon]:hidden ml-2">Return to Home</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
             <p className="text-xs text-muted-foreground mt-2 text-center group-data-[collapsible=icon]:hidden">FormWise Dashboard</p>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 p-0">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!selectedFormTitle && !error && (
              <DashboardPlaceholder uniqueFormTitlesCount={uniqueFormTitles.length} />
            )}
            
            {selectedFormTitle && currentDataSchema && (
              <>
                <SelectedFormCard
                  selectedFormTitle={selectedFormTitle}
                  filteredSubmissionsCount={filteredSubmissions.length}
                  currentDataSchema={currentDataSchema}
                  customAiInstructions={customAiInstructions}
                  onCustomAiInstructionsChange={handleCustomAiInstructionsChange}
                  handleAiAnalysis={handleAiAnalysis}
                  aiSummarizeMutation={aiSummarizeMutation}
                  aiSummary={aiSummary}
                />

                {aggregatedResultsGrid}
                
                <RawSubmissionsTable 
                  filteredSubmissions={filteredSubmissions}
                  currentDataSchema={currentDataSchema}
                />
              </>
            )}
          </main>
        </SidebarInset>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        formTitleToDelete={formTitleToDelete}
        onConfirmDelete={confirmDelete}
        onCancelDelete={handleCancelDelete}
      />
    </SidebarProvider>
  );
}

