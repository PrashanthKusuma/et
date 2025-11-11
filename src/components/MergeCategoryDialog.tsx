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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

const mergeSchema = z.object({
  targetCategoryId: z.string().min(1, 'Please select a target category.'),
  mode: z.enum(['individual', 'total']),
});

interface MergeCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceCategory: Category;
}

export function MergeCategoryDialog({ open, onOpenChange, sourceCategory }: MergeCategoryDialogProps) {
  const { state, dispatch } = useAppContext();
  const router = useRouter();

  const otherCategories = state.categories.filter(c => c.id !== sourceCategory.id) || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof mergeSchema>>({
    resolver: zodResolver(mergeSchema),
    defaultValues: {
      mode: 'individual',
    },
  });

  const onSubmit = (data: z.infer<typeof mergeSchema>) => {
    dispatch({ type: 'MERGE_CATEGORY', payload: { ...data, sourceCategoryId: sourceCategory.id } });
    reset();
    onOpenChange(false);
    router.push('/');
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
            <DialogTitle>Merge or Move Category</DialogTitle>
            <DialogDescription>
              There are no other categories to merge or move expenses to. Please create another category first.
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
          <DialogTitle>Merge or Move "{sourceCategory.name}"</DialogTitle>
          <DialogDescription>
            Choose a category to move expenses to. The "{sourceCategory.name}" category will be deleted after the operation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
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

          <div className="space-y-3">
            <Label>Merge Method</Label>
            <Controller
              name="mode"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="font-normal">Move all entries individually</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="total" id="total" />
                    <Label htmlFor="total" className="font-normal">Move as a single total sum</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Confirm Merge</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
