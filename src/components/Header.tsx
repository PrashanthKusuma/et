'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCategoryDialog } from '@/components/AddCategoryDialog';
import Link from 'next/link';

export function Header() {
  const [isAddCategoryOpen, setAddCategoryOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary">
                <rect width="256" height="256" fill="none" />
                <path
                  d="M168,40.7a96,96,0,1,0,0,174.6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <path
                  d="M88,96a96,96,0,1,1,0,64"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
              </svg>
              <span className="font-headline text-lg font-bold">FinTrack</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button onClick={() => setAddCategoryOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      </header>
      <AddCategoryDialog open={isAddCategoryOpen} onOpenChange={setAddCategoryOpen} />
    </>
  );
}
