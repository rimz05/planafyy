import { clsx, type ClassValue } from "clsx"
//utility(reusabel functions) to conditionally join class names together

import { twMerge } from "tailwind-merge"
// twMerge	Resolves conflicts between Tailwind classes


export function cn(...inputs: ClassValue[]) {
  //combine different input into single inputs
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path:string){
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}


// inputs- "p-2", "p-4", "bg-red-500", false && "text-sm", "text-lg"
// clsx- "p-2 p-4 bg-red-500 text-lg"
// twmerge -"p-4 bg-red-500 text-lg"