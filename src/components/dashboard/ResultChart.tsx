import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultChartProps {
  data: any[]; // Replace 'any' with a more specific type if possible
  chartType: 'bar' | 'line'; // Example chart types
  // Add other chart configuration props as needed
}

const ResultChart: React.FC<ResultChartProps> = ({ data, chartType }) => {
  // Add more sophisticated chart type handling if needed
  const ChartComponent = chartType === 'bar' ? BarChart : BarChart; // Replace BarChart with LineChart if you have line charts

  return (
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {chartType === 'bar' && <Bar dataKey="value" fill="#8884d8" />}
          {/* Add other chart elements like Line for line charts */}
        </ChartComponent>
      </ResponsiveContainer>
    </CardContent>
  );
};

export default ResultChart;
