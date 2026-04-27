/**
 * Sales funnel routes where the global marketing header/footer should not appear
 * (user is mid-purchase or viewing policy after login).
 */
export function hideGlobalSiteChrome(pathname: string | null): boolean {
  if (!pathname) return false;
  const prefixes = [
    '/sales/quote',
    '/sales/contact',
    '/sales/checkout',
    '/sales/products',
    '/sales/login',
    '/sales/my-policies',
  ];
  if (prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  if (pathname.startsWith('/sales/policy/')) return true;
  return false;
}
