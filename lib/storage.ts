"use client";

export type AnyObject = Record<string, unknown>;

export const saveJSON = (key: string, data: AnyObject) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
};

export const loadJSON = <T = AnyObject>(key: string): T | null => {
  try {
    if (typeof window === "undefined") return null;
    const v = window.localStorage.getItem(key);
    if (!v) return null;
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
};

export const debounce = <F extends (...args: any[]) => void>(fn: F, ms = 400) => {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export default { saveJSON, loadJSON, debounce };
