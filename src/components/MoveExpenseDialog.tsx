'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAppContext } from '@/context/AppContext';

const moveExpenseSchema = z.object({
  targetCategoryId: z.string().min(1, 'Please select a category.'),
});

interface MoveExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense;
}

export function MoveExpenseDialog({ open, onOpenChange, expense }: MoveExpenseDialogProps) {
  const { state, dispatch } = useAppContext();

  const otherCategories = state.categories.filter(c => c.id !== expense.categoryId) || [];
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof moveExpenseSchema>>({
    resolver: zodResolver(moveExpenseSchema),
    defaultValues: {
      targetCategoryId: '',
    },
  });

  const onSubmit = (data: z.infer<typeof moveExpenseSchema>) => {
    dispatch({ type: 'MOVE_EXPENSE', payload: { expenseId: expense.id, targetCategoryId: data.targetCategoryId } });
    reset();
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };
  
  if (otherCategories.length === 0) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Expense</DialogTitle>
            <DialogDescription>
              There are no other categories to move this expense to. Please create another category first.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move Expense</DialogTitle>
          <DialogDescription>
            Select a new category for this expense.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Move to Category</Label>
            <Controller
              name="targetCategoryId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherCategories.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.targetCategoryId && <p className="text-sm text-destructive">{errors.targetCategoryId.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit">Move Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
