import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CATEGORY_COLORS, CATEGORY_TEXT_COLORS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export const getCategoryTextColor = (color: string) => {
  const index = CATEGORY_COLORS.indexOf(color);
  if (index !== -1) {
    return CATEGORY_TEXT_COLORS[index];
  }
  return 'hsl(var(--foreground))';
};
