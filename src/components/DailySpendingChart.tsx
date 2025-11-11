'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getYear, getMonth, subYears } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function DailySpendingChart() {
  const { state } = useAppContext();
  const { expenses } = state;

  const currentYear = getYear(new Date());
  const currentMonth = getMonth(new Date());

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const years = useMemo(() => {
    const end = currentYear;
    const start = getYear(subYears(new Date(), 5));
    return Array.from({ length: end - start + 1 }, (_, i) => end - i);
  }, [currentYear]);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: format(new Date(selectedYear, i), 'MMMM'),
    }));
  }, [selectedYear]);

  const chartData = useMemo(() => {
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const dailyTotals = daysInMonth.map(day => {
        const total = expenses
            .filter(expense => isSameDay(new Date(expense.date), day))
            .reduce((sum, expense) => sum + expense.amount, 0);

        return {
            name: format(day, 'd'),
            Spending: total,
        };
    });

    return dailyTotals;
  }, [expenses, selectedYear, selectedMonth]);
  
  const hasSpending = useMemo(() => chartData.some(d => d.Spending > 0), [chartData]);
  const selectedDate = new Date(selectedYear, selectedMonth);

  const compactFormatter = new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
    currency: 'INR',
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Daily Spending</CardTitle>
            <div className="flex gap-2">
                <Select
                    value={selectedMonth.toString()}
                    onValueChange={(value) => setSelectedMonth(parseInt(value, 10))}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map(month => (
                            <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(parseInt(value, 10))}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasSpending ? (
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} label={{ value: format(selectedDate, 'MMMM yyyy'), position: 'insideBottom', dy: 10 }} />
                        <YAxis 
                          stroke="#888888" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(value) => compactFormatter.format(value as number)}
                        />
                        <Tooltip 
                            cursor={{fill: 'hsl(var(--secondary))', radius: 'var(--radius)'}}
                            formatter={(value: number) => [formatCurrency(value), "Spending"]}
                            labelFormatter={(label) => format(new Date(selectedYear, selectedMonth, parseInt(label)), 'MMMM d, yyyy')}
                        />
                        <Legend iconSize={10} verticalAlign="top" align="right" />
                        <Bar dataKey="Spending" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No spending data for {format(selectedDate, 'MMMM yyyy')}.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
