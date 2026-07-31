import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

interface DailyPnL {
  [date: string]: number;
}

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

    // Group trades by day
    const dailyPnL: DailyPnL = {};
    let cumulativePnL = 0;
    const equityData: any[] = [];

    for (const trade of trades.sort((a, b) => 
      new Date(a.opened_at).getTime() - new Date(b.opened_at).getTime()
    )) {
      if (trade.closed_at && trade.profit_loss !== null) {
        const date = new Date(trade.closed_at).toISOString().split('T')[0];
        dailyPnL[date] = (dailyPnL[date] || 0) + trade.profit_loss;
        cumulativePnL += trade.profit_loss;

        equityData.push({
          date: new Date(trade.closed_at).toLocaleDateString('fr-FR'),
          equity: cumulativePnL,
          balance: cumulativePnL,
          trades: Object.keys(dailyPnL).length,
        });
      }
    }

    res.status(200).json({ equityData, dailyPnL });
  } catch (error: any) {
    console.error('Error fetching equity curve:', error);
    res.status(500).json({ error: error.message });
  }
}
