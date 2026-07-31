import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

interface DayStats {
  dayName: string;
  trades: number;
  wins: number;
  winRate: number;
  totalPnL: number;
  avgPnL: number;
}

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

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

    const dayStats: Record<number, { trades: number; wins: number; totalPnL: number }> = {
      0: { trades: 0, wins: 0, totalPnL: 0 },
      1: { trades: 0, wins: 0, totalPnL: 0 },
      2: { trades: 0, wins: 0, totalPnL: 0 },
      3: { trades: 0, wins: 0, totalPnL: 0 },
      4: { trades: 0, wins: 0, totalPnL: 0 },
      5: { trades: 0, wins: 0, totalPnL: 0 },
      6: { trades: 0, wins: 0, totalPnL: 0 },
    };

    for (const trade of trades) {
      if (trade.closed_at && trade.profit_loss !== null) {
        const day = new Date(trade.closed_at).getDay();
        dayStats[day].trades++;
        dayStats[day].totalPnL += trade.profit_loss;
        if (trade.profit_loss > 0) {
          dayStats[day].wins++;
        }
      }
    }

    const result = DAYS.map((dayName, index) => ({
      dayName,
      trades: dayStats[index].trades,
      wins: dayStats[index].wins,
      winRate: dayStats[index].trades > 0 ? (dayStats[index].wins / dayStats[index].trades) * 100 : 0,
      totalPnL: dayStats[index].totalPnL,
      avgPnL: dayStats[index].trades > 0 ? dayStats[index].totalPnL / dayStats[index].trades : 0,
    }));

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error fetching weekday performance:', error);
    res.status(500).json({ error: error.message });
  }
}
