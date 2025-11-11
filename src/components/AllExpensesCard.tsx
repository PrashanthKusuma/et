'use client';

import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { EditTotalBudgetDialog } from './EditTotalBudgetDialog';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import { Progress } from './ui/progress';

export function AllExpensesCard() {
  const { state } = useAppContext();
  const [isEditTotalBudgetOpen, setEditTotalBudgetOpen] = useState(false);

  const { expenses, totalBudgetTarget } = state;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const progress = totalBudgetTarget > 0 ? (totalExpenses / totalBudgetTarget) * 100 : 0;

  return (
    <>
      <Link href="/all-expenses" className="block">
        <Card className="h-full transition-all hover:shadow-xl hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-headline">All Expenses</CardTitle>
            <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditTotalBudgetOpen(true); }}>
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-primary">{formatCurrency(totalExpenses)}</div>
            <p className="text-sm text-muted-foreground">
              of {formatCurrency(totalBudgetTarget)} budget
            </p>
            <div className="pt-2">
              <Progress value={progress} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {progress.toFixed(0)}% of budget used
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
      <EditTotalBudgetDialog
        open={isEditTotalBudgetOpen}
        onOpenChange={setEditTotalBudgetOpen}
        totalBudgetTarget={totalBudgetTarget}
      />
    </>
  );
}
