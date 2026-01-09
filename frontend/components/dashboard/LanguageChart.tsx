'use client'

import { useLanguages } from '@/hooks/user';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

const COLORS = [
  '#3b82f6', '#fbbf24', '#1e40af', '#3b82f6', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#6366f1'
];

export default function LanguageChart() {
  const { languages, loading, error } = useLanguages();

  if (loading) {
    return <div className="h-80 rounded-xl bg-muted animate-pulse" />;
  }

  if (error) {
    return <div className="text-sm text-destructive">Error loading languages</div>;
  }

  if (!languages?.languages || languages.languages.length === 0) {
    return <div className="text-sm text-muted-foreground">No language data</div>;
  }

  const chartData = languages.languages.map((lang) => ({
    name: lang.language,
    value: parseFloat(lang.percentage.toFixed(1)) || 0,
  }));

  return (
    <Card className="backdrop-blur bg-card/80">
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
          <span role="img" aria-label="laptop">💻</span>
          Languages
        </CardTitle>
        <CardDescription>Distribution of your top stacks</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | undefined) => `${value?.toFixed?.(1) ?? value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full space-y-2">
          {chartData.map((lang, index) => (
            <div
              key={lang.name}
              className="flex items-center justify-between rounded-md px-2 py-1"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-foreground">{lang.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{lang.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
        
