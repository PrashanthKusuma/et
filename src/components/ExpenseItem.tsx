'use client';

import type { Expense } from '@/lib/types';
import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit, Move } from 'lucide-react';
import { Button } from './ui/button';
import { formatCurrency, getCategoryTextColor } from '@/lib/utils';
import { DeleteDialog } from './DeleteDialog';
import { EditExpenseDialog } from './EditExpenseDialog';
import { MoveExpenseDialog } from './MoveExpenseDialog';
import { useAppContext } from '@/context/AppContext';
import { Badge } from './ui/badge';

interface ExpenseItemProps {
  expense: Expense;
  showCategory?: boolean;
}

export function ExpenseItem({ expense, showCategory = false }: ExpenseItemProps) {
  const { state, dispatch } = useAppContext();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isMoveOpen, setMoveOpen] = useState(false);

  const category = showCategory ? state.categories.find(c => c.id === expense.categoryId) : null;

  const handleDelete = () => {
    dispatch({ type: 'DELETE_EXPENSE', payload: expense.id });
    setDeleteOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-secondary/50">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <span className="text-xl">{format(new Date(expense.date), 'dd')}</span>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">{expense.description}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(expense.date), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {category && (
            <Badge style={{ backgroundColor: category.color, color: getCategoryTextColor(category.color) }}>
              {category.name}
            </Badge>
          )}
          <p className="font-semibold text-lg">{formatCurrency(expense.amount)}</p>
          <Button variant="ghost" size="icon" onClick={() => setMoveOpen(true)} className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Move className="h-4 w-4" />
            <span className="sr-only">Move expense</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit expense</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete expense</span>
          </Button>
        </div>
      </div>
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Expense"
        description={`Are you sure you want to delete this expense? This action cannot be undone.`}
      />
      <EditExpenseDialog
        open={isEditOpen}
        onOpenChange={setEditOpen}
        expense={expense}
      />
      <MoveExpenseDialog
        open={isMoveOpen}
        onOpenChange={setMoveOpen}
        expense={expense}
      />
    </>
  );
}
