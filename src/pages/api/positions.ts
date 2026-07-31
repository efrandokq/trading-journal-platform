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

  const { accountId } = req.query;
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

    const accessToken = decryptToken(account.access_token);
    const client = new cTraderClient(accessToken);
    const positions = await client.getPositions(Number(accountId));

    res.status(200).json({ positions });
  } catch (error: any) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ error: error.message });
  }
}
