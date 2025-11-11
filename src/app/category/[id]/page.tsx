'use client';

import { useParams } from 'next/navigation';
import CategoryDetailView from '@/components/CategoryDetailView';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';

export default function CategoryPage() {
  const params = useParams();
  const { id } = params;
  const { state, loading } = useAppContext();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  const categoryId = Array.isArray(id) ? id[0] : id;

  const category = state.categories.find(c => c.id === categoryId);
  const categoryExpenses = state.expenses.filter(e => e.categoryId === categoryId);

  if (!category) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Category not found.</p>
      </div>
    );
  }

  return <CategoryDetailView category={category} expenses={categoryExpenses || []} />;
}
