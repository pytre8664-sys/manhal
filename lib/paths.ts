/**
 * GitHub Pages serves the app under /manhal. `next/link` and the router add the
 * basePath automatically, but manual `window.location.href` assignments do not.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
