'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { useMemo } from 'react';
import { CHART_COLORS } from '@/lib/constants';

export function ExpenseDistributionChart() {
  const { state } = useAppContext();
  const { expenses, categories } = state;

  const chartData = useMemo(() => {
    if (categories.length === 0 || expenses.length === 0) return [];
    
    const categorySpending = categories.map((category, index) => {
      const total = expenses
        .filter(expense => expense.categoryId === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        name: category.name,
        value: total,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    }).filter(item => item.value > 0);

    return categorySpending;
  }, [expenses, categories]);

  if (chartData.length === 0) {
    return (
        <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No expense data available for the chart.</p>
        </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => `${((entry.percent || 0) * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number, name: string) => [value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), name]}
                />
                <Legend iconSize={10} />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
}
