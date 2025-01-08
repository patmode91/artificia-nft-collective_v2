import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "util"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatString(formatStr: string, ...args: any[]): string {
  return format(formatStr, ...args)
}
