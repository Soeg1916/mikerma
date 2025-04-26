import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(price);
}

export function truncateString(str: string, maxLength: number = 100): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export const serviceCategories = [
  { id: 'smm', name: 'SMM Services', icon: 'hashtag' },
  { id: 'subscription', name: 'Subscription Services', icon: 'calendar-check' },
  { id: 'advertising', name: 'Advertising Services', icon: 'ad' },
  { id: 'game', name: 'Game Top-ups', icon: 'gamepad' },
  { id: 'social', name: 'Social - Buy & Sell', icon: 'users' },
  { id: 'streaming', name: 'Streaming Services', icon: 'play' },
  { id: 'giftcards', name: 'Gift Cards', icon: 'gift' }
];

export function getCategoryById(id: string) {
  return serviceCategories.find(category => category.id === id);
}

export function getCategoryNameById(id: string): string {
  const category = getCategoryById(id);
  return category ? category.name : 'Unknown Category';
}
