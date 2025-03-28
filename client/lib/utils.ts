// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
  }
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-Us", {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

// export function getAuth(date: string) {
//   return new Date(date).toLocaleDateString("en-Us", {
//     month: 'long',
//     day: 'numeric',
//     year: 'numeric'
//   })
// }





export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}