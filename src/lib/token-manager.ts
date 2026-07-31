import { db } from '@/lib/db';
import { decryptToken } from '@/lib/encryption';
import { cTraderClient } from '@/lib/ctrader';

const tokenRefreshQueue: Map<number, NodeJS.Timeout> = new Map();

export async function scheduleTokenRefresh(
  accountId: number,
  userId: number,
  expiresAt: Date
) {
  // Cancel existing timeout if any
  if (tokenRefreshQueue.has(accountId)) {
    clearTimeout(tokenRefreshQueue.get(accountId)!);
  }

  // Refresh token 5 minutes before expiry
  const now = Date.now();
  const refreshTime = expiresAt.getTime() - 5 * 60 * 1000 - now;

  const timeout = setTimeout(async () => {
    await refreshUserToken(accountId, userId);
  }, Math.max(refreshTime, 0));

  tokenRefreshQueue.set(accountId, timeout);
}

export async function refreshUserToken(accountId: number, userId: number) {
  try {
    const account = await db.ctraderAccounts.findByUserIdAndAccountId(
      userId,
      BigInt(accountId)
    );

    if (!account || !account.refresh_token) {
      console.error('Account not found or no refresh token');
      return;
    }

    const encryptedRefreshToken = account.refresh_token;
    const refreshToken = decryptToken(encryptedRefreshToken);

    const tokenData = await cTraderClient.refreshAccessToken(refreshToken);

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    await db.ctraderAccounts.updateToken(
      account.id,
      tokenData.access_token,
      tokenData.refresh_token,
      expiresAt
    );

    console.log(`✅ Token refreshed for account ${accountId}`);

    // Schedule next refresh
    scheduleTokenRefresh(accountId, userId, expiresAt);
  } catch (error) {
    console.error(`❌ Token refresh failed for account ${accountId}:`, error);
  }
}

export function cancelTokenRefresh(accountId: number) {
  if (tokenRefreshQueue.has(accountId)) {
    clearTimeout(tokenRefreshQueue.get(accountId)!);
    tokenRefreshQueue.delete(accountId);
  }
}
