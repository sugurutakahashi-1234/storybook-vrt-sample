import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS のクラス名を条件付きで結合・マージする
 *
 * clsx で条件分岐やファルシーな値の除去を行い、
 * tailwind-merge で競合するユーティリティクラスを解決する。
 *
 * @example
 * cn("px-2 py-1", isActive && "bg-blue-500", className)
 * cn("text-sm text-red-500", "text-blue-500") // → "text-sm text-blue-500"
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
