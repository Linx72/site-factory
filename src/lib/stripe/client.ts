import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Lazy Stripe client. Returns null when STRIPE_SECRET_KEY is unset (demo mode). */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;

  stripeClient ??= new Stripe(key);

  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
