'use client';

import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { EditTotalBudgetDialog } from './EditTotalBudgetDialog';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export function AllExpensesCard() {
  const { state } = useAppContext();
  const [isEditTotalBudgetOpen, setEditTotalBudgetOpen] = useState(false);

  const { expenses, totalBudgetTarget } = state;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <>
      <Link href="/all-expenses" className="block">
        <Card className="h-full transition-all hover:shadow-xl hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-headline">All Expenses</CardTitle>
            <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditTotalBudgetOpen(true); }}>
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(totalExpenses)}</div>
            <p className="text-sm text-muted-foreground">
              Total Budget Target: {formatCurrency(totalBudgetTarget)}
            </p>
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
