'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import type { Category, Expense } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

type State = {
  categories: Category[];
  expenses: Expense[];
  totalBudgetTarget: number;
};

type Action =
  | { type: 'SET_STATE'; payload: State }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'MOVE_EXPENSE', payload: { expenseId: string, targetCategoryId: string } }
  | { type: 'MERGE_CATEGORY', payload: { sourceCategoryId: string, targetCategoryId: string, mode: 'individual' | 'total' } }
  | { type: 'UPDATE_TOTAL_BUDGET'; payload: number };

const initialState: State = {
  categories: [],
  expenses: [],
  totalBudgetTarget: 25000,
};

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STATE':
        return action.payload;
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CATEGORY': {
      const categoryId = action.payload;
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== categoryId),
        expenses: state.expenses.filter(e => e.categoryId !== categoryId),
      };
    }
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(e =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(e => e.id !== action.payload),
      };
    case 'MOVE_EXPENSE': {
      const { expenseId, targetCategoryId } = action.payload;
      return {
          ...state,
          expenses: state.expenses.map(e => 
              e.id === expenseId ? { ...e, categoryId: targetCategoryId } : e
          )
      };
    }
    case 'MERGE_CATEGORY': {
      const { sourceCategoryId, targetCategoryId, mode } = action.payload;
      const expensesToMove = state.expenses.filter(e => e.categoryId === sourceCategoryId);
      let newExpenses = state.expenses.filter(e => e.categoryId !== sourceCategoryId);
      
      if (mode === 'individual') {
        const movedExpenses = expensesToMove.map(e => ({ ...e, categoryId: targetCategoryId }));
        newExpenses = [...newExpenses, ...movedExpenses];
      } else { // 'total'
        const totalAmount = expensesToMove.reduce((sum, e) => sum + e.amount, 0);
        if (totalAmount > 0) {
            const sourceCategory = state.categories.find(c => c.id === sourceCategoryId);
            newExpenses.push({
                id: uuidv4(),
                amount: totalAmount,
                date: new Date().toISOString(),
                description: `Merged from ${sourceCategory?.name || 'Unknown Category'}`,
                categoryId: targetCategoryId,
            });
        }
      }
      
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== sourceCategoryId),
        expenses: newExpenses,
      };
    }
    case 'UPDATE_TOTAL_BUDGET':
        return { ...state, totalBudgetTarget: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
    loading: boolean;
  }>({
    state: initialState,
    dispatch: () => null,
    loading: true,
  });

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      try {
        const storedState = localStorage.getItem('finTrackState');
        if (storedState) {
          dispatch({ type: 'SET_STATE', payload: JSON.parse(storedState) });
        }
      } catch (error) {
        console.error("Could not load state from localStorage", error);
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
        if (!loading) {
            try {
                localStorage.setItem('finTrackState', JSON.stringify(state));
            } catch (error) {
                console.error("Could not save state to localStorage", error);
            }
        }
    }, [state, loading]);
  
    return (
      <AppContext.Provider value={{ state, dispatch, loading }}>
        {children}
      </AppContext.Provider>
    );
}

export function useAppContext() {
  return useContext(AppContext);
}
