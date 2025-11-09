import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

  return Math.max(0, totalMonths); // Prevent negative values
}
