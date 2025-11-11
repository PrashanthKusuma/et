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
import { CATEGORY_COLORS } from '@/lib/constants';
import { useAppContext } from '@/context/AppContext';
import { getCategoryTextColor } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required.'),
  budget: z.coerce.number().min(0, 'Budget must be a positive number.'),
  color: z.string().min(1, 'Please select a color.'),
});

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
  const { dispatch } = useAppContext();
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      budget: 0,
      color: CATEGORY_COLORS[0],
    },
  });

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: { ...data, id: uuidv4() } });
    toast({
      title: 'Category Created',
      description: `Category "${data.name}" has been successfully created.`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category to track your expenses.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input id="name" {...field} />}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => <Input id="budget" type="number" step="0.01" {...field} />}
            />
            {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map((color, index) => (
                    <button
                      type="button"
                      key={color}
                      className={`h-8 w-8 rounded-full border-2 ${field.value === color ? 'border-primary ring-2 ring-ring' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => field.onChange(color)}
                    >
                      <span className="sr-only" style={{color: getCategoryTextColor(color)}}>Select color {index}</span>
                    </button>
                  ))}
                </div>
              )}
            />
             {errors.color && <p className="text-sm text-destructive">{errors.color.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Create Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
