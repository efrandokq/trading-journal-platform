# ⚡ Quick Start - 5 minutes

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

```bash
# Copy from .env.local.example
cp .env.local.example .env.local
```

**Then edit with:**
```env
# From cTrader Dev Portal
CTRADER_CLIENT_ID=your_client_id
CTRADER_CLIENT_SECRET=your_client_secret

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=trading_journal

# Generated keys above
NEXTAUTH_SECRET=<paste_first_key_here>
ENCRYPTION_KEY=<paste_second_key_here>
```

## 5. Database Setup 📝

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

1. Click **"Se connecter avec cTrader"**
2. Log in with your cTrader account
3. Authorize the app
4. You're in! 🎉

---

### ✨ Next Steps

- 📊 Explore the Dashboard
- 💼 Check your open positions
- 📈 View trade history
- 🎯 Create trading goals
- 📝 Write journal entries

---

**🆘 Stuck?** → See [SETUP.md](./SETUP.md) for detailed troubleshooting
