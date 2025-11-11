'use client';

import { AllExpensesCard } from './AllExpensesCard';
import { CategoryCard } from './CategoryCard';
import { Header } from './Header';
import { useAppContext } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import { ExpenseDistributionChart } from './ExpenseDistributionChart';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DailySpendingChart } from './DailySpendingChart';

export default function Dashboard() {
  const { state, loading } = useAppContext();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading your financial dashboard...</p>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  const { categories } = state;

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <AllExpensesCard />

          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="categories">
                <div className="mt-6">
                    <h2 className="text-xl font-bold font-headline mb-4">Expense Categories</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map(category => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                    {categories.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground py-10">
                        <p>No categories yet. Click "Add Category" to get started!</p>
                        </div>
                    )}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="analytics">
                <div className="grid gap-6 mt-6">
                  <DailySpendingChart />
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                          <CardTitle>Expense Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <ExpenseDistributionChart />
                      </CardContent>
                    </Card>
                    <Card className="lg:col-span-3">
                      <CardHeader>
                          <CardTitle>Monthly Spending Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <MonthlyTrendChart />
                      </CardContent>
                    </Card>
                  </div>
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
