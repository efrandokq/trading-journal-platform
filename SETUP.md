# 🏰 Empire Noble North - Trading Journal Platform

Plateforme professionnelle de journal de trading intégrée avec **cTrader Open API**. Synchronisez vos positions en temps réel, analysez vos performances avec des métriques avancées (Sharpe Ratio, Profit Factor, Drawdown), et maîtrisez votre discipline de trading.

## ✨ Caractéristiques

### 🔐 Authentication & Connexion
- ✅ **OAuth2 cTrader** - Connexion sécurisée avec cTrader Open API
- ✅ **Multi-comptes** - Support des comptes démo ET live
- ✅ **Token refresh automatique** - Tokens renouvelés avant expiration
- ✅ **Encryption** - Tokens chiffrés en base de données

### 📊 Dashboard & Métriques
- ✅ **Win Rate** - Pourcentage de trades gagnants
- ✅ **Sharpe Ratio** - Rendement ajusté au risque (annualisé)
- ✅ **Profit Factor** - Ratio gains/pertes
- ✅ **Expectancy** - Gain moyen par trade
- ✅ **Max Drawdown** - Pire perte en pourcentage
- ✅ **Payoff Ratio** - Gain moyen / Perte moyenne
- ✅ **Streaks** - Séries gagnantes/perdantes
- ✅ **Courbe d'équité** - Graphique de progression (LineChart Recharts)
- ✅ **Performance par session** - Asia/London/New York
- ✅ **Performance par jour** - Statistiques du lundi au dimanche

### 📈 Visualisations
- ✅ Courbe d'équité interactive
- ✅ Graphiques de performance par session
- ✅ Analyse par jour de la semaine
- ✅ 📅 Calendrier P/L (à venir en Phase 7)

### 💼 Gestion des Positions
- ✅ **Positions ouvertes en temps réel** (WebSocket ready)
- ✅ **Modifier Stop Loss / Take Profit**
- ✅ **Break-Even** - Un clic pour mettre SL au prix d'entrée
- ✅ **Fermer position** - Depuis le dashboard
- ✅ **Auto-refresh** - Actualisation toutes les 5 secondes

### 📝 Historique & Journal
- ✅ **Table des trades** - Historique complet avec filtres
- ✅ **Filtrage** - Par symbole, résultat (gain/perte)
- ✅ **Notes par trade** - Analyse personnalisée
- ✅ **Journal libre** - Notes, lessons learned, analyse psychologique
- ✅ **Pagination** - Support des listes longues

### 🎯 Objectifs & Discipline
- ✅ **Créer des objectifs** - Win Rate, Drawdown, Profit Factor, etc.
- ✅ **Progress bars** - Visualisation de la progression
- ✅ **Tracking automatique** - Mise à jour en temps réel
- ✅ **Completion flag** - ✅ Quand l'objectif est atteint

### 🔒 Sécurité
- ✅ JWT pour les sessions
- ✅ Tokens chiffrés (AES-256-CBC)
- ✅ HTTPS en production
- ✅ Rate-limiting ready
- ✅ Données privées par utilisateur

---

## 🛠️ Tech Stack

| Couche | Technology |
|--------|------------|
| **Frontend** | Next.js 14 + React 18 + TypeScript |
| **Styling** | Tailwind CSS 3 |
| **Charts** | Recharts 2.10 |
| **Backend** | Next.js API Routes + Node.js |
| **Database** | PostgreSQL 12+ |
| **Real-time** | WebSocket (Socket.io + cTrader ProtoOA) |
| **Auth** | OAuth2 (cTrader) + JWT |
| **Security** | Token Encryption (AES-256) |
| **Hosting** | Vercel (Frontend) + Railway/Render (Backend) |

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** 18+ ([Download](https://nodejs.org))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **cTrader Account** (gratuit) - [Créer un compte](https://www.spotware.com/)
- **cTrader Developer Account** - [Portal](https://www.spotware.com/open-api/)

### 1️⃣ Clone & Install

```bash
# Clone le repository
git clone https://github.com/efrandokq/trading-journal-platform.git
cd trading-journal-platform

# Install les dépendances
npm install
```

### 2️⃣ Setup cTrader OAuth

1. Accédez à [cTrader Developer Portal](https://www.spotware.com/open-api/)
2. Créez une **ConnectorApp** nouvelle
3. Récupérez :
   - `client_id`
   - `client_secret`
   - Définissez le **Callback URL** : `http://localhost:3000/api/auth/ctrader/callback`

### 3️⃣ Setup Base de Données

```bash
# Créez une base PostgreSQL
createctl createdb trading_journal

# Ou avec psql
psql -U postgres -c "CREATE DATABASE trading_journal;"
```

### 4️⃣ Configuration Environnement

```bash
# Copiez le fichier d'exemple
cp .env.local.example .env.local

# Éditez .env.local avec vos credentials
```

**`.env.local` complet :**

```env
# cTrader OAuth
CTRADER_CLIENT_ID=your_client_id_here
CTRADER_CLIENT_SECRET=your_client_secret_here
CTRADER_REDIRECT_URI=http://localhost:3000/api/auth/ctrader/callback

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/trading_journal
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=trading_journal

# JWT & Auth
NEXTAUTH_SECRET=generate_with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Encryption (generate with: openssl rand -base64 32)
ENCRYPTION_KEY=your_base64_32_byte_key

# WebSocket
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Environment
NODE_ENV=development
```

### 5️⃣ Database Migration

```bash
# Exécutez les migrations
npm run db:migrate

# Vous devriez voir:
# 🚀 Starting database migrations...
# ✅ Database migrations completed successfully!
```

### 6️⃣ Lancer le Serveur

```bash
# Development
npm run dev

# Le serveur tourne sur http://localhost:3000
```

### 7️⃣ Tester l'Application

Ouvrez votre navigateur sur [http://localhost:3000](http://localhost:3000)

1. Cliquez sur **"Se connecter avec cTrader"**
2. Acceptez l'authorization
3. Sélectionnez votre compte cTrader
4. Accédez au dashboard ✅

---

## 📖 Guide Utilisateur

### 🔐 Première Connexion

1. **Cliquez sur "Se connecter avec cTrader"**
   - Vous serez redirigé vers cTrader OAuth
   - Connectez-vous avec votre compte cTrader
   - Acceptez l'accès aux données

2. **Sélection du Compte**
   - Si vous avez plusieurs comptes (démo/live), ils s'afficheront
   - Tous les comptes sont synchronisés automatiquement

3. **Dashboard**
   - Vous êtes maintenant sur le dashboard principal
   - Vos métriques se calculent automatiquement

### 📊 Dashboard

**Grille de métriques** (8 indicateurs clés) :
- 📈 **Win Rate** - Pourcentage de trades gagnants
- 📊 **Profit Factor** - Gains/Pertes totaux
- 📉 **Sharpe Ratio** - Rendement/Risque
- 🔴 **Max Drawdown** - Pire baisse
- 💰 **Expectancy** - Gain moyen par trade
- 📐 **Payoff Ratio** - Ratio gain/perte
- 📈 **Win Streak** - Série de gains actuelle
- 💵 **Total Profit** - Profit total

**Graphiques** :
- 📈 **Courbe d'Équité** - Progression de votre compte
- 🌍 **Performance par Session** - Résultats par fuseau horaire
- 📅 **Performance par Jour** - Statistiques quotidiennes

### 💼 Positions (En temps réel)

1. **Accédez** à `/positions`
2. **Visualisez** toutes vos positions ouvertes
3. **Actions rapides** :
   - ⚙️ **SL/TP** - Modifier Stop Loss / Take Profit
   - 📍 **BE** - Mettre SL au Break-Even
   - ✕ **Close** - Fermer la position

### 📈 Historique des Trades

1. **Accédez** à `/history`
2. **Filtrez** par :
   - 🔍 Symbole (ex: EURUSD)
   - ✅/❌ Résultat (Gagnants/Perdants/Tous)
3. **Ajoutez des notes** 📝 - Cliquez sur 📝 pour chaque trade
4. **Pagination automatique** - Chargez plus de trades

### 📔 Journal

1. **Accédez** à `/journal`
2. **Écrivez** vos observations
3. **Partagez** :
   - Analyse psychologique
   - Lessons learned
   - Observations du jour
4. **Supprimez** une entrée si nécessaire 🗑️

### 🎯 Objectifs

1. **Accédez** à `/goals`
2. **Créez un objectif** :
   - Nom (ex: "60% Win Rate")
   - Métrique (Win Rate, Drawdown, etc.)
   - Valeur cible
3. **Suivez la progression** - La barre se remplit automatiquement
4. **Célébrez** quand vous atteignez l'objectif ✅

---

## 🔧 Architecture

### Structure des Dossiers

```
trading-journal-platform/
├── src/
│   ├── pages/
│   │   ├── index.tsx              # Home page
│   │   ├── dashboard.tsx          # Dashboard principal
│   │   ├── positions.tsx          # Positions ouvertes
│   │   ├── history.tsx            # Historique des trades
│   │   ├── journal.tsx            # Journal libre
│   │   ├── goals.tsx              # Objectifs
│   │   ├── _app.tsx               # App wrapper
│   │   └── api/
│   │       ├── auth/              # OAuth routes
│   │       ├── accounts.ts        # Comptes cTrader
│   │       ├── positions.ts       # Positions
│   │       ├── trades.ts          # Trades
│   │       ├── metrics.ts         # Calcul métriques
│   │       ├── equity-curve.ts    # Courbe équité
│   │       ├── session-performance.ts
│   │       ├── weekday-performance.ts
│   │       ├── journal.ts         # Journal entries
│   │       ├── goals.ts           # Objectifs
│   │       └── positions/[id]/    # Position management
│   ├── components/
│   │   ├── Modal.tsx              # Modal générique
│   │   ├── TradeTable.tsx         # Table des trades
│   │   ├── NotesModal.tsx         # Modal notes
│   │   └── PositionActions.tsx    # Actions positions
│   ├── lib/
│   │   ├── db.ts                  # Database queries
│   │   ├── jwt.ts                 # JWT utils
│   │   ├── encryption.ts          # Token encryption
│   │   ├── ctrader.ts             # cTrader API client
│   │   ├── ctrader-ws.ts          # WebSocket client
│   │   ├── metrics.ts             # Metrics calculator
│   │   └── token-manager.ts       # Token refresh
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   └── styles/
│       └── globals.css            # Global styles
├── scripts/
│   └── migrate.js                 # Database migrations
├── .env.local.example             # Environment template
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── package.json
└── README.md
```

### Flow d'Authentification

```
1. User → Click "Se connecter avec cTrader"
   ↓
2. Frontend → /api/auth/ctrader/login
   ↓
3. Backend → Redirige vers cTrader OAuth
   ↓
4. cTrader → User accepte l'authorization
   ↓
5. cTrader → Callback to /api/auth/ctrader/callback
   ↓
6. Backend → Exchange code pour tokens
   ↓
7. Backend → Sauvegarde tokens chiffrés
   ↓
8. Backend → Crée JWT et définit cookie
   ↓
9. Frontend → Redirige vers /dashboard
```

### Flux de Données

```
cTrader Open API
        ↓
   cTrader Client (src/lib/ctrader.ts)
        ↓
API Routes (src/pages/api/)
        ↓
Database (PostgreSQL)
        ↓
Frontend Components
        ↓
User Browser
```

---

## 🗄️ Database Schema

### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### cTrader Accounts
```sql
CREATE TABLE ctrader_accounts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  account_id BIGINT NOT NULL,
  access_token TEXT,      -- Encrypted
  refresh_token TEXT,     -- Encrypted
  token_expires_at TIMESTAMP,
  account_type VARCHAR(10),  -- 'demo' or 'live'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, account_id)
);
```

### Trades
```sql
CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  account_id BIGINT NOT NULL,
  deal_id BIGINT NOT NULL UNIQUE,
  symbol VARCHAR(20),
  trade_type VARCHAR(10),  -- 'BUY' or 'SELL'
  volume DECIMAL(18,2),
  entry_price DECIMAL(18,8),
  exit_price DECIMAL(18,8),
  profit_loss DECIMAL(18,2),
  opened_at TIMESTAMP,
  closed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Trading Goals
```sql
CREATE TABLE trading_goals (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  goal_name VARCHAR(255),
  target_value DECIMAL(18,2),
  current_value DECIMAL(18,2) DEFAULT 0,
  metric VARCHAR(50),  -- 'win_rate', 'max_drawdown', etc.
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Journal Entries
```sql
CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  trade_id INT REFERENCES trades(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🧮 Calcul des Métriques

### Win Rate
```
Win Rate (%) = (Nombre de trades gagnants / Total trades) × 100
```

### Profit Factor
```
Profit Factor = Total gains / Total pertes
```

### Sharpe Ratio (Annualisé)
```
Sharpe Ratio = (Rendement moyen / Écart-type) × √252
Où 252 = nombre de jours de trading par an
```

### Max Drawdown
```
Max DD (%) = (Pire point bas - Peak) / Peak × 100
Où Peak = point haut précédent
```

### Expectancy
```
Expectancy = Profit total / Nombre de trades
```

### Payoff Ratio
```
Payoff Ratio = Gain moyen par trade gagnant / |Perte moyenne par trade perdant|
```

---

## 🔐 Sécurité

### Token Encryption

Les tokens OAuth de cTrader sont chiffrés avant sauvegarde :

```typescript
// Encryption
const encrypted = encrypt(accessToken);
// Format: "iv_hex:data_hex"

// Decryption
const decrypted = decrypt(encrypted);
```

**Algorithme** : AES-256-CBC
**Key Size** : 32 bytes (base64 encoded)
**IV** : 16 bytes random

### JWT

- **Algorithme** : HS256
- **Expiration** : 7 jours
- **Storage** : HttpOnly cookie (sécurisé)

### HTTPS en Production

```bash
# Vercel handled automatiquement
# Railway/Render : Configure SSL certificate
```

---

## 📦 Build & Deployment

### Build Production

```bash
# Build Next.js
npm run build

# Start server
npm start
```

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Configure environment variables in Vercel dashboard
```

### Railway / Render (Backend)

1. Connectez votre GitHub repo
2. Sélectionnez la branche `main`
3. Configurez les environment variables
4. Déploiement automatique sur push

---

## 🐛 Troubleshooting

### "Connection refused" pour PostgreSQL

```bash
# Vérifiez que PostgreSQL tourne
sudo service postgresql status

# Ou sur macOS
brew services list | grep postgres

# Redémarrer
sudo service postgresql restart
```

### "Invalid client_id" lors de login

✅ Vérifiez `CTRADER_CLIENT_ID` dans `.env.local`
✅ Vérifiez que c'est l'ID du ConnectorApp (pas du user)
✅ Vérifiez que `CTRADER_REDIRECT_URI` correspond exactement

### "Token expired" en API

✅ Le token refresh automatique devrait gérer ça
✅ Vérifiez `ENCRYPTION_KEY` en base64 (32 bytes)
✅ Redémarrez le serveur

### Base de données vide après migration

```bash
# Vérifiez que .env.local est correct
echo $DATABASE_URL

# Réexécutez migration
npm run db:migrate

# Vérifiez les tables
psql -U postgres -d trading_journal -c "\dt"
```

---

## 📊 Exemple d'Utilisation

### Scénario : Trader EURUSD en session London

1. **Connexion** → Authentification OAuth cTrader
2. **Dashboard** → Visualisez les 8 métriques clés
3. **Positions** → Ouvrez une position EURUSD
4. **Modification** → Ajustez le SL/TP depuis le dashboard
5. **Fermeture** → Cliquez sur "Close" quand vous prenez profit
6. **Journal** → Notez votre analyse post-trade
7. **Historique** → Consultez tous vos trades EURUSD
8. **Objectifs** → Suivez votre progression vers 60% Win Rate

---

## 🚦 Roadmap

### ✅ Complété (Phases 1-5)
- OAuth2 + Multi-comptes
- Dashboard avec 8 métriques
- Positions management (SL/TP/Close)
- Historique + Journal
- Objectifs & Discipline

### 🔜 En Développement (Phases 6-10)
- [ ] **Phase 6** : WebSocket real-time + Socket.io
- [ ] **Phase 7** : P/L Calendar Heatmap + Advanced Charts
- [ ] **Phase 8** : Deployment docs + Docker
- [ ] **Phase 9** : Testing suite + Error handling
- [ ] **Phase 10** : Documentation API + Monetization

---

## 💬 Support & Feedback

- **Issues** : [GitHub Issues](https://github.com/efrandokq/trading-journal-platform/issues)
- **Discussions** : [GitHub Discussions](https://github.com/efrandokq/trading-journal-platform/discussions)
- **Email** : efrandokq@gmail.com

---

## 📄 License

MIT License - Libre d'utilisation commerciale et personnelle

---

## 🎓 Ressources Utiles

- [cTrader Open API Docs](https://www.spotware.com/open-api/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)

---

**Made with ❤️ by efrandokq**

**Dernière mise à jour** : 2026-08-01
