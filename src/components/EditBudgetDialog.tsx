'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

const budgetSchema = z.object({
  budget: z.coerce.number().min(0, 'Budget must be a positive number.'),
});

interface EditBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
}

export function EditBudgetDialog({ open, onOpenChange, category }: EditBudgetDialogProps) {
  const { dispatch } = useAppContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budget: category.budget,
    },
  });

  useEffect(() => {
    if (open) {
      reset({ budget: category.budget });
    }
  }, [open, category, reset]);


  const onSubmit = (data: z.infer<typeof budgetSchema>) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: { ...category, budget: data.budget } });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget for {category.name}</DialogTitle>
          <DialogDescription>
            Update the budget limit for this category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="budget">New Budget</Label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => <Input id="budget" type="number" step="0.01" {...field} />}
            />
            {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
