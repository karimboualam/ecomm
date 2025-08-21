# 🛒 Plateforme E-commerce Scalable

Une plateforme e-commerce moderne et scalable construite avec une architecture microservices.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Storefront    │    │   Admin Panel   │    │   Mobile App    │
│   (Next.js)     │    │   (Next.js)     │    │   (React Native)│
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     BFF GraphQL         │
                    │   (Apollo Server)       │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                       │                        │
  ┌─────▼─────┐        ┌────────▼────────┐     ┌────────▼────────┐
  │  Catalog  │        │     Order       │     │    Payment      │
  │ Service   │        │   Service       │     │   Service       │
  └───────────┘        └─────────────────┘     └─────────────────┘
        │                       │                        │
  ┌─────▼─────┐        ┌────────▼────────┐     ┌────────▼────────┐
  │   Email   │        │   Shipping      │     │     Review      │
  │ Service   │        │   Service       │     │   Service       │
  └───────────┘        └─────────────────┘     └─────────────────┘
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd ecommerce-platform
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer les services d'infrastructure**
```bash
npm run docker:up
```

4. **Démarrer l'environnement de développement**
```bash
# Démarrer le front et le BFF seulement
npm run dev

# Ou démarrer tous les services
npm run dev:all
```

5. **Accéder aux applications**
- Storefront: http://localhost:3000
- BFF GraphQL Playground: http://localhost:4000/graphql
- Admin Grafana: http://localhost:3001 (admin/admin)
- MailHog: http://localhost:8025
- MinIO: http://localhost:9001 (minioadmin/minioadmin)

## 📁 Structure du projet

```
├── apps/                          # Applications frontend
│   ├── storefront/               # Site e-commerce (Next.js)
│   ├── admin/                    # Panel d'administration
│   └── bff/                      # Backend-for-Frontend (GraphQL)
├── services/                     # Microservices backend
│   ├── catalog/                  # Gestion des produits
│   ├── order/                    # Gestion des commandes  
│   ├── payment/                  # Gestion des paiements
│   ├── email/                    # Service d'emailing
│   ├── shipping/                 # Gestion des livraisons
│   ├── review/                   # Avis clients
│   ├── loyalty/                  # Programme de fidélité
│   ├── search/                   # Service de recherche
│   └── chat/                     # Chat & support client
├── libs/                         # Bibliothèques partagées
│   ├── shared/                   # Types & utilitaires communs
│   ├── events/                   # Système d'événements
│   ├── database/                 # Utilitaires base de données
│   └── ui/                       # Composants UI partagés
├── ops/                          # DevOps & Infrastructure
│   ├── docker/                   # Configuration Docker
│   ├── helm/                     # Charts Kubernetes
│   ├── terraform/                # Infrastructure as Code
│   └── monitoring/               # Observabilité
└── docs/                         # Documentation
```

## 🛠️ Services

### Applications Frontend
- **Storefront** - Site e-commerce client (Next.js, SSR/ISR, PWA)
- **Admin** - Panel d'administration (Next.js)
- **BFF** - Backend-for-Frontend (Apollo GraphQL, TypeScript)

### Microservices Backend
- **Catalog Service** - Produits, catégories, stock, prix
- **Order Service** - Commandes, factures, états de livraison  
- **Payment Service** - Paiements Stripe/PayPal/Klarna, webhooks
- **Email Service** - Emails transactionnels, newsletters, templates
- **Shipping Service** - Calcul des frais, étiquettes, suivi
- **Review Service** - Avis clients, modération, photos
- **Loyalty Service** - Points de fidélité, parrainage, récompenses
- **Search Service** - Recherche Typesense, autocomplétion, filtres
- **Chat Service** - Support client, chatbot IA

## 🎯 Fonctionnalités

### 🛍️ E-commerce Core
- [x] Catalogue produits avec variantes
- [x] Panier persistant (serveur + localStorage)
- [x] Checkout avec Stripe/PayPal
- [x] Gestion des commandes
- [x] Factures PDF automatiques
- [x] Emails de confirmation

### 🔍 Recherche & Navigation
- [ ] Recherche full-text (Typesense)
- [ ] Filtres facettés avancés
- [ ] Autocomplétion intelligente
- [ ] Recommandations produits

### 💳 Paiements
- [x] Stripe (cartes, SEPA, Klarna)
- [ ] PayPal Express Checkout
- [ ] Paiements récurrents
- [ ] Gestion des remboursements

### 📦 Livraison
- [ ] Calcul dynamique des frais
- [ ] Intégration Colissimo/Mondial Relay
- [ ] Génération d'étiquettes
- [ ] Suivi en temps réel

### 📧 Marketing & Communication
- [x] Emails transactionnels (confirmation, expédition)
- [ ] Newsletters segmentées  
- [ ] Campagnes d'abandon de panier
- [ ] Notifications "retour en stock"

### 👥 Gestion Client
- [ ] Comptes utilisateurs
- [ ] Programme de fidélité
- [ ] Avis et notes produits
- [ ] Support client avec chatbot IA

### 📊 Analytics & Admin
- [ ] Dashboard admin (ventes, KPI)
- [ ] Analytics Grafana/Prometheus
- [ ] Rapports de vente
- [ ] Gestion du stock

## 🔧 Scripts disponibles

### Développement
```bash
npm run dev                # Storefront + BFF
npm run dev:all           # Tous les services
npm run dev:services      # Microservices seulement
```

### Build & Tests
```bash
npm run build             # Build tous les projets
npm run test              # Tests unitaires
npm run test:e2e          # Tests end-to-end  
npm run lint              # Linting
```

### Infrastructure
```bash
npm run docker:build      # Build images Docker
npm run docker:up         # Démarrer l'infra
npm run docker:down       # Arrêter l'infra
npm run k8s:deploy        # Deploy Kubernetes
```

### Base de données
```bash
npm run migration:generate # Générer migrations
npm run migration:run     # Appliquer migrations
```

## 🐳 Services Docker

| Service | Port | Interface |
|---------|------|-----------|
| PostgreSQL | 5432 | Base de données principale |
| Redis | 6379 | Cache & sessions |
| Kafka | 9092 | Message broker |
| Typesense | 8108 | Moteur de recherche |
| Grafana | 3001 | http://localhost:3001 |
| Prometheus | 9090 | http://localhost:9090 |
| MailHog | 8025 | http://localhost:8025 |
| MinIO | 9001 | http://localhost:9001 |
| Kong Gateway | 8000 | API Gateway |

## 🌐 Environnements

### Développement
- Storefront: http://localhost:3000
- BFF GraphQL: http://localhost:4000/graphql
- Services: ports 5001-5010

### Staging
- URL: https://staging.ecommerce.com
- Déploiement automatique sur `develop`

### Production  
- URL: https://ecommerce.com
- Déploiement automatique sur `main`

## 📊 Monitoring & Observabilité

### Métriques
- **Prometheus** - Collecte des métriques
- **Grafana** - Dashboards et alertes
- **Jaeger** - Tracing distribué

### Logs
- Logs centralisés avec Loki
- Corrélation par traceId
- Alertes sur erreurs critiques

### Santé des services
```bash
curl http://localhost:4000/health    # BFF
curl http://localhost:5001/health    # Catalog
curl http://localhost:5002/health    # Order
```

## 🔐 Sécurité

### Authentification
- JWT avec refresh tokens
- OAuth2 (Google, Facebook)
- 2FA optionnel

### Autorisation
- RBAC (Role-Based Access Control)
- Permissions granulaires
- Rate limiting

### Protection des données
- Chiffrage au repos
- HTTPS obligatoire
- Conformité RGPD

## 🚀 Déploiement

### CI/CD Pipeline
1. **Tests** - Tests unitaires et e2e
2. **Build** - Images Docker multi-architecture  
3. **Security** - Scan de vulnérabilités
4. **Deploy Staging** - Auto-deploy sur develop
5. **Deploy Production** - Manuel sur main

### Kubernetes
```bash
# Deploy avec Helm
helm upgrade --install ecommerce ops/helm/ecommerce

# Scaler un service
kubectl scale deployment catalog --replicas=3
```

## 📚 Documentation

- [Guide de développement](docs/development.md)
- [API Documentation](docs/api.md)
- [Architecture détaillée](docs/architecture.md)
- [Guide de déploiement](docs/deployment.md)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Roadmap

### Phase 1 - MVP (8 semaines)
- [x] Architecture de base
- [x] Catalog & Order services
- [x] Storefront basique
- [x] Paiement Stripe
- [x] Emails transactionnels

### Phase 2 - Growth (10 semaines)
- [ ] Service de recherche
- [ ] Avis clients
- [ ] Programme de fidélité
- [ ] Admin dashboard
- [ ] Livraisons avancées

### Phase 3 - Scale (12 semaines)  
- [ ] IA & Recommendations
- [ ] Marketplace multi-vendeurs
- [ ] Chatbot support
- [ ] Analytics avancées
- [ ] Mobile app

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Product Owner** - [@username](https://github.com/username)
- **Tech Lead** - [@username](https://github.com/username)  
- **Frontend Lead** - [@username](https://github.com/username)
- **Backend Lead** - [@username](https://github.com/username)

---

💡 **Pro tip**: Utilisez `npm run dev` pour démarrer rapidement le développement avec hot-reload sur tous les services !