// User & Auth
export interface User {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// cTrader Account
export interface cTraderAccount {
  id: number;
  userId: number;
  accountId: bigint;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
  accountType: 'demo' | 'live';
  isActive: boolean;
  createdAt: Date;
}

// Trade
export interface Trade {
  id: number;
  userId: number;
  accountId: bigint;
  dealId: bigint;
  symbol: string;
  tradeType: 'BUY' | 'SELL';
  volume: number;
  entryPrice: number;
  exitPrice: number | null;
  profitLoss: number | null;
  openedAt: Date;
  closedAt: Date | null;
  notes: string | null;
  createdAt: Date;
}

// Position (Open)
export interface Position {
  id: number;
  positionId: bigint;
  userId: number;
  accountId: bigint;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  profitLoss: number;
  profitLossPercent: number;
  openedAt: Date;
  updatedAt: Date;
}

// Metrics
export interface TradeMetrics {
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  expectancy: number;
  rMultiple: number;
  payoffRatio: number;
  maxDrawdown: number;
  currentDrawdown: number;
  largestWin: number;
  largestLoss: number;
  longestWinStreak: number;
  longestLossStreak: number;
  currentWinStreak: number;
  currentLossStreak: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalDaysTrading: number;
}

// Goals
export interface TradingGoal {
  id: number;
  userId: number;
  goalName: string;
  targetValue: number;
  currentValue: number;
  metric: 'win_rate' | 'max_drawdown' | 'profit_factor' | 'sharpe_ratio' | 'daily_profit';
  createdAt: Date;
  updatedAt: Date;
}

// Journal Entry
export interface JournalEntry {
  id: number;
  userId: number;
  tradeId: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
