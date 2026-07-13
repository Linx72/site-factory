/** Stripe checkout success banner strings (server → client props). */
export type CheckoutBannerCopy = {
  successTitle: string;
  successBody: string;
  dismiss: string;
  homeHref: string;
};

export const defaultCheckoutBannerCopy: CheckoutBannerCopy = {
  successTitle: "Payment successful",
  successBody: "Thanks for subscribing — welcome aboard.",
  dismiss: "Dismiss",
  homeHref: "/",
};
