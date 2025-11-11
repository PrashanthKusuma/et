'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X, Calendar as CalendarIcon, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Expense } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from './ui/sheet';
import { Label } from './ui/label';

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

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
        const toDate = endOfDay(dateRange.to);
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
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setDateRange(undefined);
    setSortOption('date-desc');
  };

  useEffect(() => {
    if (!isSheetOpen) { // Apply filters when sheet is closed, or on any change on desktop
      applyFiltersAndSort();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, dateRange, sortOption, expenses, isSheetOpen]);
  
  const isFilterActive = searchQuery !== '' || !!dateRange?.from || !!dateRange?.to || sortOption !== 'date-desc';

  const filterControls = (
    <>
      <div className="space-y-2">
        <Label htmlFor="search-input">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
              id="search-input"
              placeholder="Search..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date-range-picker">Date Range</Label>
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date-range-picker"
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
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
      </div>
      
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger>
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="date-desc">Date: Newest</SelectItem>
                <SelectItem value="date-asc">Date: Oldest</SelectItem>
                <SelectItem value="amount-desc">Amount: High-Low</SelectItem>
                <SelectItem value="amount-asc">Amount: Low-High</SelectItem>
            </SelectContent>
        </Select>
      </div>
    </>
  );

  if (isMobile === undefined) {
    return <div className="h-[40px] animate-pulse rounded-lg border bg-muted" />;
  }

  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <div className="flex items-center gap-2">
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter & Sort {isFilterActive && <span className="ml-2 h-2 w-2 rounded-full bg-primary" />}
            </Button>
          </SheetTrigger>
          {isFilterActive && (
            <Button variant="ghost" onClick={resetFilters} size="icon" className="flex-shrink-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Clear filters</span>
            </Button>
          )}
        </div>
        <SheetContent side="bottom" className='rounded-t-lg'>
          <SheetHeader>
            <SheetTitle>Filter & Sort</SheetTitle>
            <SheetDescription>
              Refine the list of expenses.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            {filterControls}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button>Apply</Button>
            </SheetClose>
            {isFilterActive &&
                <Button variant="outline" onClick={() => { resetFilters(); setIsSheetOpen(false); }} className="mb-2 sm:mb-0">Clear Filters</Button>
            }
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="flex items-start gap-2 rounded-lg border p-2">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
        <div className="relative min-w-[150px]">
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
            <SelectTrigger className='w-full'>
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="date-desc">Date: Newest</SelectItem>
                <SelectItem value="date-asc">Date: Oldest</SelectItem>
                <SelectItem value="amount-desc">Amount: High-Low</SelectItem>
                <SelectItem value="amount-asc">Amount: Low-High</SelectItem>
            </SelectContent>
        </Select>
        
        {isFilterActive && (
          <Button variant="ghost" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
          </Button>
        )}
      </div>
    </div>
  );
}
