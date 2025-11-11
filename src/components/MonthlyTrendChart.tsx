'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { useMemo } from 'react';
import { format, subMonths, startOfMonth } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

export function MonthlyTrendChart() {
  const { state } = useAppContext();
  const { expenses } = state;

  const chartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
        return startOfMonth(subMonths(new Date(), i));
    }).reverse();

    const monthlyTotals = last6Months.map(monthDate => {
        const monthStart = monthDate;
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

        const total = expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= monthStart && expenseDate <= monthEnd;
            })
            .reduce((sum, expense) => sum + expense.amount, 0);

        return {
            name: format(monthDate, 'MMM'),
            Spending: total,
        };
    });

    return monthlyTotals;
  }, [expenses]);
  
  if (expenses.length === 0) {
    return (
        <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Not enough data to display monthly trend.</p>
        </div>
    );
  }
  
  const compactFormatter = new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
    currency: 'INR',
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
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
                />
                <Legend iconSize={10} />
                <Bar dataKey="Spending" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
