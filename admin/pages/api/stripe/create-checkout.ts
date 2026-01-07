import { NextApiRequest, NextApiResponse } from 'next';
import { stripe, PRICES } from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_id, mode = 'subscription', trial_days = 7 } = req.body || {};
  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price: PRICES.premium_month, quantity: 1 }],
    success_url: process.env.NEXT_PUBLIC_SITE_URL + '/account/subscription?success=true',
    cancel_url: process.env.NEXT_PUBLIC_SITE_URL + '/account/subscription?canceled=true',
    customer_email: req.headers['x-user-email'] as string | undefined,
    subscription_data: { trial_period_days: trial_days },
    payment_method_types: ['card', 'us_bank_account'],
    allow_promotion_codes: true,
  });
  res.json({ url: session.url });
}
