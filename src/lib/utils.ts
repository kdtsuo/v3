import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMonthsSince(createdAt: string | undefined): number {
  if (!createdAt) return 0;

  const created = new Date(createdAt);
  const now = new Date();

  const yearsDiff = now.getFullYear() - created.getFullYear();
  const monthsDiff = now.getMonth() - created.getMonth();

  const totalMonths = yearsDiff * 12 + monthsDiff;

  return Math.max(0, totalMonths);
}

export function getMonthsAndDaysSince(createdAt: string | undefined): {
  months: number;
  days: number;
} {
  if (!createdAt) return { months: 0, days: 0 };

  const created = new Date(createdAt);
  const now = new Date();

  let yearsDiff = now.getFullYear() - created.getFullYear();
  let monthsDiff = now.getMonth() - created.getMonth();
  let daysDiff = now.getDate() - created.getDate();

  if (daysDiff < 0) {
    monthsDiff -= 1;
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    daysDiff += previousMonth.getDate();
  }

  if (monthsDiff < 0) {
    yearsDiff -= 1;
    monthsDiff += 12;
  }

  const totalMonths = yearsDiff * 12 + monthsDiff;

  return {
    months: Math.max(0, totalMonths),
    days: Math.max(0, daysDiff),
  };
}
