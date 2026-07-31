# 🏰 Empire Noble North - Trading Journal Platform

Plateforme professionnelle de journal de trading intégrée avec **cTrader Open API**.

## 📋 Caractéristiques

- ✅ **OAuth2 cTrader** - Connexion sécurisée avec cTrader Open API
- ✅ **WebSocket en temps réel** - Positions, trades, balance en live via ProtoOA
- ✅ **Dashboard complet** - Métriques avancées (Sharpe, Profit Factor, Drawdown, etc.)
- ✅ **Historique des trades** - Table filtrée avec notes/journal
- ✅ **Visualisations** - Equity curve, P/L calendar, performance par session
- ✅ **Gestion des positions** - Modifier SL/TP, trailing stop, break-even
- ✅ **Objectifs & Discipline** - Suivi des goals avec progression
- ✅ **Journal entries** - Notes personnelles, analyse psychologique
- ✅ **Sécurité** - Tokens encryptés, rate-limiting, données privées

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + React 18 + Tailwind CSS
- **Backend**: Next.js API Routes + Node.js
- **Database**: PostgreSQL (Supabase compatible)
- **Real-time**: WebSocket (Socket.io + cTrader ProtoOA)
- **Charts**: Recharts
- **Security**: JWT + Token Encryption
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- PostgreSQL 12+
- cTrader Developer Account (gratuit)

### Installation

```bash
# Clone le repo
git clone https://github.com/efrandokq/trading-journal-platform.git
cd trading-journal-platform

# Installe les dépendances
npm install

# Configure l'environnement
cp .env.local.example .env.local
# Édite .env.local avec tes credentials

# Crée la base de données
npm run db:migrate

# Lance le serveur de développement
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## 📖 Documentation

- [Setup cTrader OAuth](./docs/CTRADER_OAUTH.md) (à créer)
- [Architecture WebSocket](./docs/WEBSOCKET.md) (à créer)
- [Calcul des Métriques](./docs/METRICS.md) (à créer)
- [API Reference](./docs/API.md) (à créer)

## 🔒 Sécurité

- Tokens OAuth encryptés en base de données
- Rate-limiting sur l'API cTrader
- HTTPS obligatoire en production
- Données utilisateur isolées
- JWT pour les sessions

## 📝 Roadmap

- [ ] Phase 1: OAuth + Auth Routes
- [ ] Phase 2: WebSocket Real-time
- [ ] Phase 3: Dashboard & Metrics
- [ ] Phase 4: Visualizations
- [ ] Phase 5: Trade History & Journal
- [ ] Phase 6: Position Management
- [ ] Phase 7: Goals Tracker
- [ ] Phase 8: Deployment
- [ ] Phase 9: Testing
- [ ] Phase 10: Monetization (optional)

## 👨‍💻 Contribuer

Les PRs sont bienvenues ! Ouvre une issue d'abord pour discuter des changements majeurs.

## 📄 License

MIT

## 💬 Support

- Issues: [GitHub Issues](https://github.com/efrandokq/trading-journal-platform/issues)
- Discussions: [GitHub Discussions](https://github.com/efrandokq/trading-journal-platform/discussions)

---

**Made with 💙 by efrandokq**
