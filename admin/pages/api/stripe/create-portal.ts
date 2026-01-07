import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customer_id } = req.body || {};
  const session = await stripe.billingPortal.sessions.create({ customer: customer_id, return_url: process.env.NEXT_PUBLIC_SITE_URL + '/account/subscription' });
  res.json({ url: session.url });
}
