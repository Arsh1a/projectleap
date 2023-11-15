import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNameInitials = (fullName: string) => {
  const allNames = fullName.trim().split(" ");
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, "");
  return initials;
};

export const isoToReadableDate = (date: string | null) => {
  if (!date) {
    return null;
  }
  const isoDate = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  } as const;
  const dateFormatter = new Intl.DateTimeFormat("en-US", options);

  return dateFormatter.format(isoDate);
};
