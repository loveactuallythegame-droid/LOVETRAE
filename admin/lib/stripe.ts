import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' });

export const PRICES = {
  premium_month: process.env.STRIPE_PRICE_PREMIUM_MONTH as string,
};
