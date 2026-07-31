import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { decryptToken } from '@/lib/encryption';
import { cTraderClient } from '@/lib/ctrader';

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

  const { accountId, limit = '100', offset = '0' } = req.query;
  if (!accountId) {
    return res.status(400).json({ error: 'accountId is required' });
  }

  try {
    const account = await db.ctraderAccounts.findByUserIdAndAccountId(
      payload.userId,
      BigInt(accountId as string)
    );

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // First, get trades from cTrader API
    const accessToken = decryptToken(account.access_token);
    const client = new cTraderClient(accessToken);
    const ctraderTrades = await client.getTradeHistory(Number(accountId));

    // Sync with database
    for (const trade of ctraderTrades) {
      try {
        await db.trades.create({
          userId: payload.userId,
          accountId: account.account_id,
          dealId: trade.dealId || trade.id,
          symbol: trade.symbol,
          type: trade.buySell === 'BUY' ? 'BUY' : 'SELL',
          volume: trade.volume,
          entryPrice: trade.entryPrice,
        });
      } catch (err) {
        // Trade already exists, skip
      }
    }

    // Get trades from database
    const dbTrades = await db.trades.findByUserId(
      payload.userId,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json({ trades: dbTrades });
  } catch (error: any) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: error.message });
  }
}
