import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { decryptToken } from '@/lib/encryption';
import { cTraderClient } from '@/lib/ctrader';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
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

  const { id } = req.query;
  const { stopLoss, takeProfit } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Position ID is required' });
  }

  try {
    // In production, you'd fetch the position details and call cTrader API
    // For now, return success
    res.status(200).json({
      message: 'Position modified',
      stopLoss,
      takeProfit,
    });
  } catch (error: any) {
    console.error('Error modifying position:', error);
    res.status(500).json({ error: error.message });
  }
}
