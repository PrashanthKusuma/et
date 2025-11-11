export interface Expense {
  id: string;
  amount: number;
  date: string;
  description?: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  budget: number;
}
