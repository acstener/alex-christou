import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Common UI patterns
export const patterns = {
  input: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
  button: {
    primary: "flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium shadow-sm hover:shadow-md transition-all",
    icon: "p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
  },
  card: "bg-white border border-gray-200 rounded-lg p-6",
  dropzone: {
    base: "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
    active: "border-blue-500 bg-blue-50",
    inactive: "border-gray-300 hover:border-gray-400 bg-gray-50"
  },
  heading: {
    h1: "text-4xl font-bold text-gray-900",
    h2: "text-2xl font-semibold text-gray-900",
    h3: "text-lg font-semibold text-gray-900"
  },
  text: {
    base: "text-gray-600",
    muted: "text-sm text-gray-500"
  }
} as const;
