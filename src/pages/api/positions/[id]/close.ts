import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyJWT } from '@/lib/jwt';

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

  if (!id) {
    return res.status(400).json({ error: 'Position ID is required' });
  }

  try {
    // Call cTrader API to close position
    // For now, return success
    res.status(200).json({ message: 'Position closed' });
  } catch (error: any) {
    console.error('Error closing position:', error);
    res.status(500).json({ error: error.message });
  }
}
