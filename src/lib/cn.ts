import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility for conditionally joining classNames with Tailwind merge
 * Example: cn('px-2 py-1', isActive && 'bg-blue-500', 'hover:bg-blue-600')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
