import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltipEl } from 'recharts';
import type { AggregatedResult } from '@/types/dashboard'; // Adjusted path

// Define the structure of chartConfig if it's simple and static here
// Otherwise, it might need to be passed as a prop or defined in a shared location
const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies Record<string, { label: string, color: string }>;

interface AggregatedResultCardProps {
  fieldId: string;
  result: AggregatedResult;
}

export function AggregatedResultCard({ fieldId, result }: AggregatedResultCardProps) {
  return (
    <Card key={fieldId} className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {result.type === 'number' || result.analysisHint === 'numerical' ? (
            <span className="p-1.5 rounded-md bg-primary/10 text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></span>
          ) : result.type === 'radio' || result.type === 'select' || result.analysisHint === 'categorical' ? (
            <span className="p-1.5 rounded-md bg-primary/10 text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M8 17l3-3 3 3 5-5"/></svg></span>
          ) : result.type === 'object_of_booleans' || result.type === 'boolean' || result.type === 'checkbox' ? (
            <span className="p-1.5 rounded-md bg-primary/10 text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></span>
          ) : (
            <span className="p-1.5 rounded-md bg-primary/10 text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 9h1"/><path d="M9 13h6"/><path d="M9 17h6"/></svg></span>
          )}
          {result.label}
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {result.count} {result.count === 1 ? 'response' : 'responses'}
          </span>
          {result.type && <span className="text-xs text-muted-foreground">• Type: {result.type}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result.average !== undefined && (
          <div className="p-3 bg-muted/30 rounded-lg mb-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">平均值</span>
                <span className="text-lg font-semibold text-primary">{result.average.toFixed(2)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">最小值</span>
                <span className="text-lg font-semibold">{result.min?.toFixed(2)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">最大值</span>
                <span className="text-lg font-semibold">{result.max?.toFixed(2)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">总和</span>
                <span className="text-lg font-semibold">{result.sum?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        {result.distribution && Object.keys(result.distribution).length > 0 && (
          <>
            <h4 className="font-semibold mt-2 mb-1">Distribution:</h4>
            { (result.type === 'radio' || result.type === 'select' || result.analysisHint === 'categorical' || result.type === 'object_of_booleans' || result.type === 'boolean' || (result.type === 'checkbox' && !result.options)) &&
              (Object.values(result.distribution).some((v: number) => v > 0)) ? (
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                 <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={Object.entries(result.distribution).map(([name, value]) => ({ name, count: value }))} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} tickMargin={8} />
                    <RechartsTooltipEl
                      cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'}}
                      formatter={(value) => [`${value} responses`, 'Count']}
                      labelFormatter={(label) => `Option: ${label}`}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No distribution data to chart.</p>
            )}
            <ScrollArea className="h-[120px] mt-3 border rounded-md">
                <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">选项</TableHead>
                    <TableHead className="text-right font-medium">数量</TableHead>
                    <TableHead className="text-right font-medium">百分比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(result.distribution).map(([option, count]: [string, number]) => {
                      const total: number = Object.values(result.distribution || {}).reduce((sum: number, val: number) => sum + val, 0);
                      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
                      return (
                        <TableRow key={option} className="hover:bg-muted/30">
                          <TableCell className="truncate py-1.5 max-w-[150px]">{option}</TableCell>
                          <TableCell className="text-right py-1.5">{count}</TableCell>
                          <TableCell className="text-right py-1.5">
                            <div className="flex items-center justify-end gap-1.5">
                              <span>{percentage}%</span>
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
                </Table>
            </ScrollArea>
          </>
        )}
        {result.responses && result.responses.length > 0 && result.analysisHint !== 'categorical' && result.type !== 'object_of_booleans' && (
          <>
            <h4 className="font-semibold mt-4 mb-2 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </span>
              文本响应
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {result.uniqueResponses} 个唯一值
              </span>
            </h4>
            <ScrollArea className="h-[180px] p-3 border rounded-md bg-muted/20 shadow-inner">
              <div className="space-y-2">
                {result.responses.slice(0, 20).map((resp: unknown, i: number) => (
                  <div key={i} className="p-2 bg-background rounded border border-border/40 text-sm hover:border-primary/30 transition-colors duration-200">
                    {String(resp)}
                  </div>
                ))}
                {result.responses.length > 20 &&
                  <div className="p-2 text-center text-xs text-muted-foreground italic">
                    ...还有 {result.responses.length - 20} 条更多响应
                  </div>
                }
              </div>
            </ScrollArea>
          </>
        )}
        {result.count === 0 && <p className="text-sm text-muted-foreground">No responses for this field.</p>}
      </CardContent>
    </Card>
  );
} 