import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

interface SessionStats {
  sessionName: string;
  trades: number;
  wins: number;
  winRate: number;
  totalPnL: number;
  avgPnL: number;
}

const SESSION_HOURS = {
  asia: { start: 0, end: 8 },
  london: { start: 8, end: 16 },
  newyork: { start: 13, end: 21 },
};

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

    const sessionStats = {
      asia: { trades: 0, wins: 0, totalPnL: 0, hours: [] as any[] },
      london: { trades: 0, wins: 0, totalPnL: 0, hours: [] as any[] },
      newyork: { trades: 0, wins: 0, totalPnL: 0, hours: [] as any[] },
    };

    for (const trade of trades) {
      if (trade.closed_at && trade.profit_loss !== null) {
        const hour = new Date(trade.closed_at).getUTCHours();
        let session: keyof typeof sessionStats | null = null;

        if (hour >= SESSION_HOURS.asia.start && hour < SESSION_HOURS.asia.end) {
          session = 'asia';
        } else if (hour >= SESSION_HOURS.london.start && hour < SESSION_HOURS.london.end) {
          session = 'london';
        } else if (hour >= SESSION_HOURS.newyork.start && hour < SESSION_HOURS.newyork.end) {
          session = 'newyork';
        }

        if (session) {
          sessionStats[session].trades++;
          sessionStats[session].totalPnL += trade.profit_loss;
          if (trade.profit_loss > 0) {
            sessionStats[session].wins++;
          }
        }
      }
    }

    const result = {
      asia: {
        sessionName: 'Asia',
        trades: sessionStats.asia.trades,
        wins: sessionStats.asia.wins,
        winRate: sessionStats.asia.trades > 0 ? (sessionStats.asia.wins / sessionStats.asia.trades) * 100 : 0,
        totalPnL: sessionStats.asia.totalPnL,
        avgPnL: sessionStats.asia.trades > 0 ? sessionStats.asia.totalPnL / sessionStats.asia.trades : 0,
      },
      london: {
        sessionName: 'London',
        trades: sessionStats.london.trades,
        wins: sessionStats.london.wins,
        winRate: sessionStats.london.trades > 0 ? (sessionStats.london.wins / sessionStats.london.trades) * 100 : 0,
        totalPnL: sessionStats.london.totalPnL,
        avgPnL: sessionStats.london.trades > 0 ? sessionStats.london.totalPnL / sessionStats.london.trades : 0,
      },
      newyork: {
        sessionName: 'New York',
        trades: sessionStats.newyork.trades,
        wins: sessionStats.newyork.wins,
        winRate: sessionStats.newyork.trades > 0 ? (sessionStats.newyork.wins / sessionStats.newyork.trades) * 100 : 0,
        totalPnL: sessionStats.newyork.totalPnL,
        avgPnL: sessionStats.newyork.trades > 0 ? sessionStats.newyork.totalPnL / sessionStats.newyork.trades : 0,
      },
    };

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error fetching session performance:', error);
    res.status(500).json({ error: error.message });
  }
}
