'use client';

import { useAppContext } from '@/context/AppContext';
import { ExpenseItem } from '@/components/ExpenseItem';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo, useEffect } from 'react';
import type { Expense } from '@/lib/types';
import { SearchAndFilter } from '@/components/SearchAndFilter';

export default function AllExpensesPage() {
  const { state, loading } = useAppContext();
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[] | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  // Use original expenses from context for filtering, and filteredExpenses for display
  const expensesToDisplay = useMemo(() => filteredExpenses ?? state.expenses.slice().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [filteredExpenses, state.expenses]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex-none w-10">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
          </div>
          <h1 className="flex-1 text-center font-headline text-lg font-bold truncate">All Expenses</h1>
          <div className="w-10 h-9 flex-none" />
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>All Expenses List</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchAndFilter expenses={state.expenses} onFilterChange={setFilteredExpenses} />
            <div className="space-y-4 mt-4">
              {expensesToDisplay.map(expense => (
                <ExpenseItem key={expense.id} expense={expense} showCategory />
              ))}
              {expensesToDisplay.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                  <p>No expenses match your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
