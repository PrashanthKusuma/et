'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X, Calendar as CalendarIcon, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Expense } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

const searchSchema = z.object({
  query: z.string(),
});

interface SearchAndFilterProps {
  expenses: Expense[];
  onFilterChange: (filteredExpenses: Expense[]) => void;
}

export function SearchAndFilter({ expenses, onFilterChange }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  const applyFiltersAndSort = () => {
    let filtered = [...expenses];

    // Apply search query
    const query = searchQuery.toLowerCase();
    if (query) {
      filtered = filtered.filter(expense => 
        expense.description?.toLowerCase().includes(query) || 
        expense.amount.toString().includes(query)
      );
    }

    // Apply date range
    if (dateRange?.from) {
        const fromDate = startOfDay(dateRange.from);
        filtered = filtered.filter(e => new Date(e.date) >= fromDate);
    }
    if (dateRange?.to) {
        const toDate = startOfDay(dateRange.to);
        filtered = filtered.filter(e => new Date(e.date) <= toDate);
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc': return a.amount - b.amount;
        case 'date-desc':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    onFilterChange(filtered);
    if(isMobile) {
      setIsSheetOpen(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    form.reset({ query: '' });
    setDateRange(undefined);
    setSortOption('date-desc');
    // We call onFilterChange with a sorted version of the original expenses.
    // The original sorting logic for all expenses was just a default sort.
    const defaultSortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    onFilterChange(defaultSortedExpenses);
    if(isMobile) {
      setIsSheetOpen(false);
    }
  };

  // Automatically apply filters on desktop when any filter value changes
  useEffect(() => {
    if (isMobile === false) { // explicit check for false to avoid running on initial undefined
      applyFiltersAndSort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, dateRange, sortOption, isMobile, expenses]);
  
  const isFilterActive = searchQuery !== '' || dateRange?.from || dateRange?.to || sortOption !== 'date-desc';
  
  const filterControls = (
    <>
      <div className={cn("relative", isMobile ? 'w-full' : 'flex-grow')}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            placeholder="Search..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Popover>
          <PopoverTrigger asChild>
              <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                      "w-full justify-start text-left font-normal",
                      !isMobile && "w-[260px]",
                      !dateRange && "text-muted-foreground"
                  )}
              >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                      dateRange.to ? (
                          <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>
                      ) : (
                          format(dateRange.from, "LLL dd, y")
                      )
                  ) : (
                      <span>Pick a date range</span>
                  )}
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={isMobile ? 1 : 2}
              />
          </PopoverContent>
      </Popover>

      <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
          <SelectTrigger className={cn(!isMobile && 'w-[180px]')}>
              <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="date-desc">Date: Newest</SelectItem>
              <SelectItem value="date-asc">Date: Oldest</SelectItem>
              <SelectItem value="amount-desc">Amount: High-Low</SelectItem>
              <SelectItem value="amount-asc">Amount: Low-High</SelectItem>
          </SelectContent>
      </Select>
    </>
  );

  if (isMobile === undefined) {
    return <div className="h-[58px] animate-pulse rounded-lg border bg-muted" />; // Or some other placeholder
  }

  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter & Sort
            {isFilterActive && <span className="ml-2 h-2 w-2 rounded-full bg-primary" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-lg">
          <SheetHeader>
            <SheetTitle>Filter & Sort</SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              {filterControls}
            </div>
            <div className="flex flex-col gap-2">
                <Button onClick={applyFiltersAndSort}>Apply Filters</Button>
                {isFilterActive && (
                    <Button variant="ghost" onClick={resetFilters}>Clear Filters</Button>
                )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border p-2">
      {filterControls}
      {isFilterActive && (
        <Button variant="ghost" onClick={resetFilters} size="icon" className="h-9 w-9">
            <X className="h-4 w-4" />
            <span className="sr-only">Clear filters</span>
        </Button>
      )}
    </div>
  );
}
