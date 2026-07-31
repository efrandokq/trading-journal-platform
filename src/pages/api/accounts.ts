import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { decryptToken } from '@/lib/encryption';
import { cTraderClient } from '@/lib/ctrader';
import { scheduleTokenRefresh } from '@/lib/token-manager';

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
    const accounts = await db.ctraderAccounts.findAllByUserId(payload.userId);

    const accountsWithDetails = await Promise.all(
      accounts.map(async (account: any) => {
        try {
          const accessToken = decryptToken(account.access_token);
          const client = new cTraderClient(accessToken);
          const info = await client.getAccountInfo(account.account_id);

          // Schedule token refresh
          if (account.token_expires_at) {
            scheduleTokenRefresh(account.id, payload.userId, new Date(account.token_expires_at));
          }

          return {
            id: account.id,
            accountId: account.account_id,
            accountType: account.account_type,
            ...info,
          };
        } catch (error) {
          console.error(`Failed to fetch account ${account.account_id}:`, error);
          return {
            id: account.id,
            accountId: account.account_id,
            accountType: account.account_type,
            error: 'Failed to fetch account info',
          };
        }
      })
    );

    res.status(200).json({ accounts: accountsWithDetails });
  } catch (error: any) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: error.message });
  }
}
