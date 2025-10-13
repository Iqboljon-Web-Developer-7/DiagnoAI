import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatNumber(number: number) {
  if (typeof number !== 'number' || number < 1 || !Number.isFinite(number)) {
    return "Please provide a valid number greater than or equal to 1";
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function isAllNumbers(str: string): boolean {
  return /^\d+$/.test(str); 
}

export function formatPrice(price: number | string) {
  if (isAllNumbers(price.toString())) {
    return formatNumber(Number(price)) + " UZS";
  }
  return price;
}
