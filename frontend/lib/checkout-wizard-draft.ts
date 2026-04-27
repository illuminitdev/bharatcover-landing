/** sessionStorage key for checkout wizard draft (see app/sales/checkout/page.tsx). */
export const CHECKOUT_WIZARD_STORAGE_KEY = 'bharatcover_checkout_wizard';

/** Drop saved step + form draft (call when starting a new guest checkout). */
export function clearCheckoutWizardDraft(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(CHECKOUT_WIZARD_STORAGE_KEY);
  }
}
