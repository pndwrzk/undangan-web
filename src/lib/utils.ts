import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateGuestCode(side: number, group?: string | null) {
  const sideChar = side === 0 ? "G" : "B";
  const groupChar = group && group.length > 0 ? group.charAt(0).toUpperCase() : "X";
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${sideChar}${groupChar}${randomChars}`;
}
