'use client';

import type { Category } from '@/lib/types';
import { formatCurrency, getCategoryTextColor } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { state } = useAppContext();
  
  const expensesForCategory = state.expenses.filter(
    expense => expense.categoryId === category.id
  );
  const spentAmount = expensesForCategory.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const budget = category.budget;
  const progress = budget > 0 ? (spentAmount / budget) * 100 : 0;
  
  const textColor = getCategoryTextColor(category.color);

  return (
    <Link href={`/category/${category.id}`} className="block">
      <Card className="h-full shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-lg">{category.name}</CardTitle>
          </div>
          <CardDescription>Budget: {formatCurrency(budget)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <span className="text-2xl font-bold text-primary">{formatCurrency(spentAmount)}</span>
            <span className="text-sm text-muted-foreground"> / {formatCurrency(budget)}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            {progress.toFixed(0)}% of budget used
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
