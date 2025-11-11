'use client';

import type { Category, Expense } from '@/lib/types';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, PlusCircle, Trash2, Merge, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Progress } from './ui/progress';
import { formatCurrency, getCategoryTextColor } from '@/lib/utils';
import { ExpenseItem } from './ExpenseItem';
import { AddExpenseDialog } from './AddExpenseDialog';
import { EditBudgetDialog } from './EditBudgetDialog';
import { DeleteDialog } from './DeleteDialog';
import { MergeCategoryDialog } from './MergeCategoryDialog';
import { SearchAndFilter } from './SearchAndFilter';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAppContext } from '@/context/AppContext';

interface CategoryDetailViewProps {
  category: Category;
  expenses: Expense[];
}

export default function CategoryDetailView({ category, expenses: initialExpenses }: CategoryDetailViewProps) {
  const { dispatch } = useAppContext();
  const router = useRouter();
  
  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [isEditBudgetOpen, setEditBudgetOpen] = useState(false);
  const [isDeleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [isMergeCategoryOpen, setMergeCategoryOpen] = useState(false);
  
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[] | null>(null);

  const expenses = useMemo(() => filteredExpenses ?? initialExpenses, [filteredExpenses, initialExpenses]);
  
  const spentAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const progress = category.budget > 0 ? (spentAmount / category.budget) * 100 : 0;

  const handleDeleteCategory = () => {
    dispatch({ type: 'DELETE_CATEGORY', payload: category.id });
    router.push('/');
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="flex-none">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
            </div>
            <h1 className="flex-1 text-center font-headline text-lg font-bold truncate px-4">{category.name}</h1>
            <div className="flex-none">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setEditBudgetOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Budget</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setMergeCategoryOpen(true)}>
                    <Merge className="mr-2 h-4 w-4" />
                    <span>Merge/Move</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setDeleteCategoryOpen(true)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Category</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-sm text-muted-foreground">Spent</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(spentAmount)}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-lg font-semibold">{formatCurrency(category.budget)}</p>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{progress.toFixed(0)}% Used</span>
                  <span>Remaining: {formatCurrency(category.budget - spentAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex-row items-center justify-between pb-4'>
              <h2 className="text-xl font-bold font-headline">Expenses</h2>
              <Button onClick={() => setAddExpenseOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </CardHeader>
            <CardContent>
              <SearchAndFilter expenses={initialExpenses} onFilterChange={setFilteredExpenses} />
              <div className="space-y-4 mt-4">
                {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))}
                {expenses.length === 0 && (
                  <div className="text-center text-muted-foreground py-10">
                    <p>No expenses recorded in this category yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </main>
      </div>
      <AddExpenseDialog open={isAddExpenseOpen} onOpenChange={setAddExpenseOpen} categoryId={category.id} />
      <EditBudgetDialog open={isEditBudgetOpen} onOpenChange={setEditBudgetOpen} category={category} />
      <DeleteDialog 
        open={isDeleteCategoryOpen} 
        onOpenChange={setDeleteCategoryOpen} 
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete the "${category.name}" category? All associated expenses will also be deleted.`}
      />
      <MergeCategoryDialog open={isMergeCategoryOpen} onOpenChange={setMergeCategoryOpen} sourceCategory={category} />
    </>
  );
}
