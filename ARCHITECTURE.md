# 🏗️ Architecture & Development Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                            │
│              (Next.js React Components)                     │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/HTTPS
┌────────────────▼────────────────────────────────────────────┐
│              NEXT.JS API ROUTES                             │
│         (/pages/api/*)                                      │
│    - Auth (OAuth2)                                          │
│    - Positions, Trades                                      │
│    - Metrics, Goals                                         │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/WebSocket
┌────────────────▼────────────────────────────────────────────┐
│           CTRADER OPEN API                                  │
│      (REST + ProtoOA WebSocket)                             │
│    - OAuth2 Authorization                                   │
│    - Positions, Trades Sync                                 │
│    - Real-time Updates                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│           POSTGRESQL DATABASE                               │
│    - Users, Accounts, Trades                                │
│    - Goals, Journal Entries                                 │
│    - Encrypted Tokens                                       │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### OAuth2 cTrader

```
User
  │
  ├─ Clicks "Login with cTrader"
  │  └─ GET /api/auth/ctrader/login
  │     └─ Generates state token
  │     └─ Redirects to: https://api.spotware.com/oauth/authorize?...
  │
  ├─ cTrader Shows Authorization Dialog
  │  └─ User logs in
  │  └─ User clicks "Authorize"
  │
  └─ cTrader Redirects Back
     └─ GET /api/auth/ctrader/callback?code=...&state=...
        └─ Validates state
        └─ Exchanges code for tokens:
           └─ POST https://api.spotware.com/oauth/token
        └─ Gets user accounts from cTrader API
        └─ Creates/updates user in DB
        └─ Stores encrypted tokens
        └─ Issues JWT cookie
        └─ Redirects to /dashboard
```

### Session Management

```
Client                    Server              Database
  │                         │                    │
  ├─ GET /api/auth/me       │                    │
  │────────────────────────→│                    │
  │                         ├─ Verify JWT token  │
  │                         ├─ GET user(id)      │
  │                         │───────────────────→│
  │                         │←───────────────────│
  │←─ {user: {...}}         │                    │
  │                         │                    │
  └─ If invalid, redirect to /
```

## API Routes Structure

### Authentication

```
/api/auth/
  ├── me.ts                      # GET - Current user
  ├── logout.ts                  # POST - Clear auth
  └── ctrader/
      ├── login.ts               # GET - Initiate OAuth
      └── callback.ts            # GET - OAuth callback
```

### Data Fetching

```
/api/
  ├── accounts.ts                # GET - User's cTrader accounts
  ├── positions.ts               # GET - Open positions
  ├── trades.ts                  # GET - Trade history
  ├── metrics.ts                 # GET - Calculated metrics
  ├── equity-curve.ts            # GET - Equity data for chart
  ├── session-performance.ts     # GET - Performance by session
  ├── weekday-performance.ts     # GET - Performance by day
  ├── journal-entries.ts         # GET - Journal entries
  ├── journal/[id].ts            # DELETE - Delete entry
  ├── goals/
  │   ├── index.ts               # GET/POST - Goals
  │   └── [id].ts                # PATCH - Update goal
  ├── trades/[id]/
  │   └── notes.ts               # PUT - Update trade notes
  └── positions/[id]/
      ├── modify.ts              # POST - Modify SL/TP
      └── close.ts               # POST - Close position
```

## Database Layer

### Connection

```typescript
// src/lib/db.ts
import pg from 'postgres';

const sql = pg({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});
```

### Query Examples

```typescript
// CREATE
const user = await db.users.create(email, hashedPassword);

// READ
const user = await db.users.findById(id);
const trades = await db.trades.findByUserId(userId);

// UPDATE
await db.trades.updateNotes(tradeId, notes);
await db.ctraderAccounts.updateToken(accountId, token, refreshToken, expiresAt);

// DELETE
// Handled through API routes, not direct DB queries
```

## Real-time Updates (Phase 6)

### WebSocket Connection

```typescript
// src/lib/ctrader-ws.ts
import WebSocket from 'ws';

const ws = new cTraderWebSocket(
  'wss://live-oas.spotware.com/socket',
  accountId,
  accessToken
);

await ws.connect();

// Listen for events
ws.on('position-updated', (position) => {
  io.to(`account-${accountId}`).emit('position', position);
});

ws.on('trade-opened', (trade) => {
  io.to(`account-${accountId}`).emit('trade', trade);
});
```

### Socket.io Client

```typescript
// Frontend
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WS_URL);

socket.on('position', (position) => {
  setPositions(prev => updatePosition(prev, position));
});

socket.on('balance-updated', (balance) => {
  setBalance(balance);
});
```

## Token Management

### Encryption

```typescript
// src/lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(token, 'utf8'),
    cipher.final(),
  ]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptToken(encryptedData: string): string {
  const [ivHex, dataHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
```

### Automatic Refresh

```typescript
// src/lib/token-manager.ts

export function scheduleTokenRefresh(
  accountId: number,
  userId: number,
  expiresAt: Date
) {
  const refreshTime = expiresAt.getTime() - 5 * 60 * 1000 - Date.now();

  setTimeout(async () => {
    const account = await db.ctraderAccounts.findByUserIdAndAccountId(
      userId,
      BigInt(accountId)
    );

    const refreshToken = decryptToken(account.refresh_token);
    const tokenData = await cTraderClient.refreshAccessToken(refreshToken);

    await db.ctraderAccounts.updateToken(
      account.id,
      encryptToken(tokenData.access_token),
      encryptToken(tokenData.refresh_token),
      new Date(Date.now() + tokenData.expires_in * 1000)
    );
  }, Math.max(refreshTime, 0));
}
```

## Metrics Calculation

### Sharpe Ratio

```typescript
private static calculateSharpeRatio(trades: Trade[]): number {
  const dailyPnL = this.groupByDay(trades);
  const returns = Object.values(dailyPnL);

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  // Annualized (252 trading days)
  return (mean / stdDev) * Math.sqrt(252);
}
```

### Max Drawdown

```typescript
private static calculateMaxDrawdown(trades: Trade[]): number {
  let peak = 0;
  let maxDD = 0;
  let cumPnL = 0;

  for (const trade of trades) {
    cumPnL += trade.profit_loss || 0;
    if (cumPnL > peak) peak = cumPnL;

    const dd = ((cumPnL - peak) / Math.abs(peak)) * 100;
    if (dd < maxDD) maxDD = dd;
  }

  return maxDD;
}
```

## Frontend State Management

### Component Hierarchy

```
App (_app.tsx)
  ├── Dashboard
  │   ├── MetricsGrid
  │   ├── EquityCurve (Recharts)
  │   ├── SessionPerformance (BarChart)
  │   └── WeekdayPerformance (BarChart)
  ├── Positions
  │   ├── PositionsSummary
  │   ├── PositionsTable
  │   └── PositionActions (Modal)
  ├── History
  │   ├── TradeTable
  │   └── NotesModal
  ├── Goals
  │   ├── GoalForm
  │   └── GoalCards (with progress bars)
  └── Journal
      ├── JournalForm
      └── JournalEntries
```

### Data Flow

```
[Component]
     ↓
[useEffect] ──fetch──→ [API Route]
     ↓                     ↓
[useState]            [DB Query]
     ↓                     ↓
[setData]    ←──JSON────[Response]
     ↓
[Render with data]
```

## Error Handling

### API Routes

```typescript
if (!token) {
  return res.status(401).json({ error: 'Not authenticated' });
}

if (!payload) {
  return res.status(401).json({ error: 'Invalid token' });
}

if (!id) {
  return res.status(400).json({ error: 'Trade ID is required' });
}

try {
  // Logic
} catch (error: any) {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
}
```

## Testing (Phase 9)

### Jest Unit Tests

```typescript
describe('TradeMetrics', () => {
  it('should calculate win rate correctly', () => {
    const trades = [
      { profit_loss: 100 },
      { profit_loss: -50 },
      { profit_loss: 200 },
    ];

    expect(MetricsCalculator.calculate(trades).winRate).toBeCloseTo(66.67, 1);
  });
});
```

## Deployment

### Environment Variables

**Production Checklist:**
- [ ] `NODE_ENV=production`
- [ ] `CTRADER_REDIRECT_URI` points to production URL
- [ ] `DATABASE_URL` uses production database
- [ ] `ENCRYPTION_KEY` is 32-byte base64
- [ ] `NEXTAUTH_SECRET` is strong
- [ ] All environment variables set in hosting platform

### Vercel

```bash
vercel env add CTRADER_CLIENT_ID
vercel env add CTRADER_CLIENT_SECRET
# etc...
vercel deploy --prod
```

### Docker (Future)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD npm start
```

---

**Next Step:** Review [SETUP.md](./SETUP.md) for detailed configuration
