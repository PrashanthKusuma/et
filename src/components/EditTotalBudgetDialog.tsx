'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

const totalBudgetSchema = z.object({
  totalBudget: z.coerce.number().min(0, 'Budget must be a positive number.'),
});

interface EditTotalBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalBudgetTarget: number;
}

export function EditTotalBudgetDialog({ open, onOpenChange, totalBudgetTarget }: EditTotalBudgetDialogProps) {
  const { dispatch } = useAppContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof totalBudgetSchema>>({
    resolver: zodResolver(totalBudgetSchema),
    defaultValues: {
      totalBudget: totalBudgetTarget || 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({ totalBudget: totalBudgetTarget });
    }
  }, [open, totalBudgetTarget, reset]);

  const onSubmit = (data: z.infer<typeof totalBudgetSchema>) => {
    dispatch({ type: 'UPDATE_TOTAL_BUDGET', payload: data.totalBudget });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Total Budget Target</DialogTitle>
          <DialogDescription>
            Set a new target for your overall monthly budget.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="totalBudget">New Budget Target</Label>
            <Controller
              name="totalBudget"
              control={control}
              render={({ field }) => <Input id="totalBudget" type="number" step="100" {...field} />}
            />
            {errors.totalBudget && <p className="text-sm text-destructive">{errors.totalBudget.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
