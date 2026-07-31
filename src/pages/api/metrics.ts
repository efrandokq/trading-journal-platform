import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { MetricsCalculator } from '@/lib/metrics';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const trades = await db.trades.findAllClosedByUserId(payload.userId);
    const metrics = MetricsCalculator.calculate(trades);

    res.status(200).json({ metrics });
  } catch (error: any) {
    console.error('Error calculating metrics:', error);
    res.status(500).json({ error: error.message });
  }
}
