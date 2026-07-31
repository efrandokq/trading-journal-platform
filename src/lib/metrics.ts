import { Trade } from '@/types';

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
  totalProfit: number;
  averageWin: number;
  averageLoss: number;
  disciplineScore: number;
}

export class MetricsCalculator {
  static calculate(trades: Trade[]): TradeMetrics {
    const closedTrades = trades.filter(t => t.closed_at && t.profit_loss !== null);
    const wins = closedTrades.filter(t => t.profit_loss! > 0);
    const losses = closedTrades.filter(t => t.profit_loss! < 0);
    const evens = closedTrades.filter(t => t.profit_loss! === 0);

    return {
      winRate: this.calculateWinRate(wins, closedTrades),
      profitFactor: this.calculateProfitFactor(wins, losses),
      sharpeRatio: this.calculateSharpeRatio(closedTrades),
      expectancy: this.calculateExpectancy(closedTrades),
      rMultiple: this.calculateRMultiple(closedTrades),
      payoffRatio: this.calculatePayoffRatio(wins, losses),
      maxDrawdown: this.calculateMaxDrawdown(closedTrades),
      currentDrawdown: this.calculateCurrentDrawdown(closedTrades),
      largestWin: this.calculateLargestWin(wins),
      largestLoss: this.calculateLargestLoss(losses),
      longestWinStreak: this.calculateLongestStreak(closedTrades, 'win'),
      longestLossStreak: this.calculateLongestStreak(closedTrades, 'loss'),
      currentWinStreak: this.calculateCurrentStreak(closedTrades, 'win'),
      currentLossStreak: this.calculateCurrentStreak(closedTrades, 'loss'),
      totalTrades: closedTrades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      totalDaysTrading: this.calculateTotalDaysTrading(closedTrades),
      totalProfit: closedTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0),
      averageWin: wins.length > 0 ? wins.reduce((sum, t) => sum + t.profit_loss!, 0) / wins.length : 0,
      averageLoss: losses.length > 0 ? losses.reduce((sum, t) => sum + t.profit_loss!, 0) / losses.length : 0,
      disciplineScore: this.calculateDisciplineScore(closedTrades),
    };
  }

  private static calculateWinRate(wins: Trade[], total: Trade[]): number {
    if (total.length === 0) return 0;
    return (wins.length / total.length) * 100;
  }

  private static calculateProfitFactor(wins: Trade[], losses: Trade[]): number {
    const totalWins = wins.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
    const totalLosses = Math.abs(losses.reduce((sum, t) => sum + (t.profit_loss || 0), 0));

    if (totalLosses === 0) return totalWins > 0 ? 999.99 : 0;
    return totalWins / totalLosses;
  }

  private static calculateSharpeRatio(trades: Trade[]): number {
    if (trades.length === 0) return 0;

    const dailyPnL = this.groupByDay(trades);
    const returns = Object.values(dailyPnL).map(pnl => pnl);

    if (returns.length === 0) return 0;

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    // Annualized Sharpe Ratio (252 trading days)
    const dailySharpe = mean / stdDev;
    return dailySharpe * Math.sqrt(252);
  }

  private static calculateExpectancy(trades: Trade[]): number {
    if (trades.length === 0) return 0;
    const totalProfit = trades.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
    return totalProfit / trades.length;
  }

  private static calculateRMultiple(trades: Trade[]): number {
    if (trades.length === 0) return 0;

    let totalRMultiple = 0;
    let count = 0;

    for (const trade of trades) {
      if (trade.profit_loss !== null && trade.profit_loss !== undefined) {
        // Assuming risk per trade is 1% of entry price (simplified)
        const risk = Math.abs(trade.entry_price * 0.01);
        if (risk > 0) {
          totalRMultiple += trade.profit_loss / risk;
          count++;
        }
      }
    }

    return count > 0 ? totalRMultiple / count : 0;
  }

  private static calculatePayoffRatio(wins: Trade[], losses: Trade[]): number {
    const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + (t.profit_loss || 0), 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + (t.profit_loss || 0), 0) / losses.length) : 0;

    if (avgLoss === 0) return avgWin > 0 ? 999.99 : 0;
    return avgWin / avgLoss;
  }

  private static calculateMaxDrawdown(trades: Trade[]): number {
    if (trades.length === 0) return 0;

    let peak = 0;
    let maxDD = 0;
    let cumPnL = 0;

    for (const trade of trades) {
      cumPnL += trade.profit_loss || 0;
      if (cumPnL > peak) {
        peak = cumPnL;
      }
      const dd = ((cumPnL - peak) / Math.abs(peak)) * 100;
      if (dd < maxDD) {
        maxDD = dd;
      }
    }

    return maxDD;
  }

  private static calculateCurrentDrawdown(trades: Trade[]): number {
    if (trades.length === 0) return 0;

    let peak = 0;
    let cumPnL = 0;

    for (const trade of trades) {
      cumPnL += trade.profit_loss || 0;
      if (cumPnL > peak) {
        peak = cumPnL;
      }
    }

    if (peak === 0) return 0;
    return ((cumPnL - peak) / peak) * 100;
  }

  private static calculateLargestWin(wins: Trade[]): number {
    if (wins.length === 0) return 0;
    return Math.max(...wins.map(t => t.profit_loss || 0));
  }

  private static calculateLargestLoss(losses: Trade[]): number {
    if (losses.length === 0) return 0;
    return Math.min(...losses.map(t => t.profit_loss || 0));
  }

  private static calculateLongestStreak(trades: Trade[], type: 'win' | 'loss'): number {
    if (trades.length === 0) return 0;

    let maxStreak = 0;
    let currentStreak = 0;

    for (const trade of trades) {
      const isWin = trade.profit_loss! > 0;
      if ((type === 'win' && isWin) || (type === 'loss' && !isWin && trade.profit_loss! < 0)) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }

  private static calculateCurrentStreak(trades: Trade[], type: 'win' | 'loss'): number {
    if (trades.length === 0) return 0;

    let streak = 0;

    for (let i = trades.length - 1; i >= 0; i--) {
      const trade = trades[i];
      const isWin = trade.profit_loss! > 0;

      if ((type === 'win' && isWin) || (type === 'loss' && !isWin && trade.profit_loss! < 0)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private static calculateTotalDaysTrading(trades: Trade[]): number {
    if (trades.length === 0) return 0;

    const days = new Set<string>();
    for (const trade of trades) {
      const date = new Date(trade.opened_at).toISOString().split('T')[0];
      days.add(date);
    }

    return days.size;
  }

  private static calculateDisciplineScore(trades: Trade[]): number {
    if (trades.length === 0) return 100;

    let score = 100;

    // Penalize too many trades per day
    const tradesPerDay = this.groupByDay(trades);
    const avgPerDay = trades.length / Object.keys(tradesPerDay).length;
    if (avgPerDay > 10) score -= Math.min(20, (avgPerDay - 10) * 2);

    // Reward consistent trading
    const tradingDays = Object.keys(tradesPerDay).length;
    if (tradingDays >= 20) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private static groupByDay(trades: Trade[]): Record<string, number> {
    const grouped: Record<string, number> = {};

    for (const trade of trades) {
      const date = new Date(trade.opened_at).toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + (trade.profit_loss || 0);
    }

    return grouped;
  }
}
