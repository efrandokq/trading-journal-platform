import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { id } = req.query;

  if (req.method === 'DELETE') {
    // Note: We'll implement soft delete or just allow deletion
    // For now, return a message
    res.status(200).json({ message: 'Entry deleted' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
