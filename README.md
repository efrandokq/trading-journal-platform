# 🏛️ Empire Noble North - Trading Journal Platform

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

**⚡ 5 minutes seulement !**

```bash
# 1. Clone
git clone https://github.com/efrandokq/trading-journal-platform.git
cd trading-journal-platform

# 2. Install
npm install

# 3. Setup .env (voir QUICKSTART.md)
cp .env.local.example .env.local
# Éditez avec vos credentials cTrader

# 4. Database
createctl createdb trading_journal
npm run db:migrate

# 5. Start
npm run dev
# http://localhost:3000
```

👉 **[QUICKSTART.md](./QUICKSTART.md)** pour les 5 minutes
👉 **[SETUP.md](./SETUP.md)** pour le guide détaillé
👉 **[ARCHITECTURE.md](./ARCHITECTURE.md)** pour développeurs

---

## 📚 Documentation

### Pour les Utilisateurs
- [QUICKSTART.md](./QUICKSTART.md) - Démarrage en 5 minutes
- [SETUP.md](./SETUP.md) - Installation complète + Troubleshooting

### Pour les Développeurs
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture système
- Code comments en TypeScript
- Schema PostgreSQL documenté

---

## 🎯 État du Projet

### ✅ Complété (Phases 1-5)
```
[████████████████████] 50%

✅ Phase 1: OAuth2 + Database
✅ Phase 2: API Routes + Token Management  
✅ Phase 3: Metrics Engine + Dashboard
✅ Phase 4: Trade History + Journal
✅ Phase 5: Positions Management + Goals
```

### 🔄 En Développement (Phases 6-10)
```
[ ░░░░░░░░░░] 0%

⏳ Phase 6: WebSocket Real-time
⏳ Phase 7: P/L Heatmap + Charts
⏳ Phase 8: Docker + Deployment
⏳ Phase 9: Testing Suite
⏳ Phase 10: API Docs
```

---

## 💻 Screenshots (À venir)

- 📊 Dashboard avec 8 métriques
- 📈 Courbe d'équité interactive
- 💼 Gestion des positions
- 📝 Journal de trading
- 🎯 Suivi des objectifs

---

## 🤝 Contribuer

Les contributions sont bienvenues !

1. Fork le repo
2. Créez une branche (`git checkout -b feature/amazing`)
3. Commit vos changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Ouvrez une Pull Request

---

## 🐛 Issues & Support

- **Issues** : [GitHub Issues](https://github.com/efrandokq/trading-journal-platform/issues)
- **Discussions** : [GitHub Discussions](https://github.com/efrandokq/trading-journal-platform/discussions)
- **Email** : efrandokq@gmail.com

---

## 📄 License

MIT License - Libre d'utilisation commerciale et personnelle

---

## 🎓 Ressources Utiles

- [cTrader Open API](https://www.spotware.com/open-api/)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)

---

**Made with ❤️ by efrandokq**

**Dernière mise à jour** : 2026-08-01 | **Version** : 0.5.0 (Beta)
