# 🎯 Quick Start - 5 minutes

## 1. Prerequisites Check ✅

```bash
node --version  # Should be 18+
psql --version  # PostgreSQL installed
```

## 2. Clone & Install 📦

```bash
git clone https://github.com/efrandokq/trading-journal-platform.git
cd trading-journal-platform
npm install
```

## 3. Generate Keys 🔑

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY
openssl rand -base64 32
```

## 4. Setup `.env.local` ⚙️

```env
# Copy from .env.local.example
cp .env.local.example .env.local

# Then edit with:
# 1. Your cTrader client_id / secret
# 2. PostgreSQL credentials
# 3. Generated keys above
```

## 5. Database Setup 🗄️

```bash
# Create database
createctl createdb trading_journal

# Run migrations
npm run db:migrate
```

## 6. Start Dev Server 🚀

```bash
npm run dev
# Open http://localhost:3000
```

## 7. Login with cTrader 🔐

1. Click "Se connecter avec cTrader"
2. Authorize the app
3. You're in! 🎉

---

**🆘 Stuck?** See [SETUP.md](./SETUP.md) for detailed troubleshooting
