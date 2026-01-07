import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { serviceSupabase } from '@/lib/supabaseClient';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'] as string;
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks);
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (e) {
    res.status(400).send('invalid');
    return;
  }
  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object;
    const user_id = sub.metadata?.user_id;
    await serviceSupabase.from('subscriptions').upsert({ user_id, status: sub.status, customer_id: sub.customer, current_period_end: new Date(sub.current_period_end * 1000).toISOString(), trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null, grace_until: null });
  } else if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const user_id = sub.metadata?.user_id;
    await serviceSupabase.from('subscriptions').upsert({ user_id, status: 'canceled' });
  } else if (event.type === 'invoice.payment_failed') {
    const inv = event.data.object;
    const user_id = inv.metadata?.user_id;
    const graceUntil = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString();
    await serviceSupabase.from('subscriptions').upsert({ user_id, status: 'past_due', grace_until: graceUntil });
  } else if (event.type === 'invoice.payment_succeeded') {
    const inv = event.data.object;
    const user_id = inv.metadata?.user_id;
    await serviceSupabase.from('subscriptions').upsert({ user_id, status: 'active', grace_until: null });
  }
  res.json({ received: true });
}
