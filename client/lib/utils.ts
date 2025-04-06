// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

import apiClient from "./apiClient";

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

export const fetchData = async ({ setUser }: any) => {
  try {
    const response = await apiClient().get(`authenticated`);
    setUser(response.data);
  } catch (err) {

    console.error(err);
  }
};


export const Colors = {
  green: '#22b14c',
  red: '#ed1c24',
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}