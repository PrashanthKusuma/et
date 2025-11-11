'use client';

import type { Expense } from '@/lib/types';
import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit, Move, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { formatCurrency, getCategoryTextColor } from '@/lib/utils';
import { DeleteDialog } from './DeleteDialog';
import { EditExpenseDialog } from './EditExpenseDialog';
import { MoveExpenseDialog } from './MoveExpenseDialog';
import { useAppContext } from '@/context/AppContext';
import { Badge } from './ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface ExpenseItemProps {
  expense: Expense;
  showCategory?: boolean;
}

export function ExpenseItem({ expense, showCategory = false }: ExpenseItemProps) {
  const { state, dispatch } = useAppContext();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isMoveOpen, setMoveOpen] = useState(false);
  const isMobile = useIsMobile();

  const category = showCategory ? state.categories.find(c => c.id === expense.categoryId) : null;

  const handleDelete = () => {
    dispatch({ type: 'DELETE_EXPENSE', payload: expense.id });
    setDeleteOpen(false);
  };

  const actionButtons = (
    <div className="flex items-center">
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
  );

  const actionMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setMoveOpen(true)}>
          <Move className="mr-2 h-4 w-4" />
          <span>Move</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setEditOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setDeleteOpen(true)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <div className="flex items-center gap-4 rounded-lg border p-3 hover:bg-secondary/50">
        <div className="flex-grow min-w-0">
          <p className="font-semibold truncate">{expense.description || "Uncategorized"}</p>
          <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground mt-1">
            <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
            {category && (
              <Badge style={{ backgroundColor: category.color, color: getCategoryTextColor(category.color) }} className="truncate">
                {category.name}
              </Badge>
            )}
            <span className="flex-grow"></span> {/* Spacer */}
            <p className="font-semibold text-base text-foreground ml-auto mr-2">{formatCurrency(expense.amount)}</p>
            {isMobile ? actionMenu : actionButtons}
          </div>
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
