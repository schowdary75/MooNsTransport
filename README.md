<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/logo-dark.svg">
    <img src="docs/images/logo.png" alt="MooN logo" width="220">
  </picture>
</p>

<h1 align="center">MooNsTransport</h1>

<p align="center">
  <strong>India's Transit Super-App — Multi-modal routing, live tracking, train schedules, metro ticketing, bus networks, and unified payments.</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Source--Available-2ea44f?style=flat-square" alt="License: Source-Available" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-20+-5FA04E?style=flat-square&amp;logo=nodedotjs&amp;logoColor=white" alt="Node.js 20+" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&amp;logo=typescript&amp;logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://turbo.build/"><img src="https://img.shields.io/badge/Turborepo-Monorepo-000000?style=flat-square&amp;logo=turborepo&amp;logoColor=white" alt="Turborepo" /></a>
  <a href="https://docs.docker.com/compose/"><img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&amp;logo=docker&amp;logoColor=white" alt="Docker Compose" /></a>
  <a href="SECURITY.md"><img src="https://img.shields.io/badge/security-policy-2ea44f?style=flat-square&amp;logo=github" alt="Security policy" /></a>
</p>

<p align="center">
  <a href="https://github.com/schowdary75/MooNsTransport"><img src="https://img.shields.io/github/stars/schowdary75/MooNsTransport?style=flat-square&amp;logo=github&amp;cacheSeconds=1800" alt="GitHub stars" /></a>
  <a href="https://github.com/schowdary75/MooNsTransport/forks"><img src="https://img.shields.io/github/forks/schowdary75/MooNsTransport?style=flat-square&amp;logo=github" alt="GitHub forks" /></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/contributions-welcome-6f42c1?style=flat-square" alt="Contributions welcome" /></a>
  <a href="DEVELOPMENT.md"><img src="https://img.shields.io/badge/local_development-ready-2C847C?style=flat-square&amp;logo=googlechrome&amp;logoColor=white" alt="Local Development" /></a>
</p>

---

MooNsTransport is an end-to-end, multi-modal urban and inter-city transit super-app designed for India's complex mobility ecosystem — integrating railways, metro lines, state/private buses, cabs, auto-rickshaws, bike rentals, and flight links into a unified trip planner and digital ticketing command center.

> [!IMPORTANT]
> **Forking, Licensing & Branding Policy:**
> Developers and teams are welcome to fork this repository and develop locally under the [MooNs Source-Available Community License](LICENSE).
> **Removing or altering our licenses, copyright notices, trademarks, or MooNs branding is strictly illegal.**
> Any fork, modification, or derivative project MUST retain full MooNs branding, logos, and licensing intact. Sublicensing or relicensing under MIT, Apache, or other permissive licenses is strictly prohibited. Commercial SaaS hosting, transit fleet operation, or production deployment requires prior written agreement from MooNs.

---

## 32 Completed Modules Overview

MooNsTransport includes a comprehensive suite of 32 fully developed transit modules:

### Phase 1: Foundation
- **1.1 Monorepo Setup**: High-velocity Turborepo workspace orchestrating apps, services, and shared packages.
- **1.2 Database Schema**: Multi-tenant relational data models for routes, stations, vehicles, and bookings.
- **1.3 Authentication**: Scalable user authentication with phone OTP, session management, and role-based access.
- **1.4 Map Foundation**: Vector tile map engine with interactive stop markers, live position rendering, and route overlays.
- **1.5 OpenTripPlanner**: Graph-based multi-modal routing engine calculating walking, transit transfers, and schedules.
- **1.6 Web Shell**: Accessible, responsive PWA web shell built for mobile-first commuters.

### Phase 2: Core Product
- **2.1 Multi-Modal Planner**: Unified door-to-door itinerary engine optimizing for time, cost, and transfer count.
- **2.2 Live Tracking**: Real-time vehicle location streaming via WebSockets and telemetry ingestion.
- **2.3 Train Module**: Indian Railways / IRCTC schedule search, live train running status, and PNR tracking.
- **2.4 Bus Module**: Intercity and city bus schedules, live bus stop ETAs, and seat selection.
- **2.5 Metro Module**: Station navigation, line interchanges, fare calculators, and QR entry ticketing.
- **2.6 Payments System**: UPI, card, and net-banking checkout pipelines with idempotency keys.
- **2.7 Push Notifications**: Real-time departure alerts, platform changes, and trip reminders.
- **2.8 User Profile**: Saved commutes, frequent routes, payment methods, and travel history.

### Phase 3: Full Mobility Services
- **3.1 Flights Module**: Domestic flight discovery, airport transit connections, and booking links.
- **3.2 Cab & Auto Module**: First-mile / last-mile ride hailing integrations and fare estimations.
- **3.3 Bike Rentals**: Micro-mobility dock discovery, battery status, and unlock workflows.
- **3.4 Car Rentals**: Self-drive rental car catalog, pickup locations, and deposit handling.
- **3.5 Admin Portal**: Central operations dashboard for transit authority staff and fleet managers.
- **3.6 Support System**: Commuter helpdesk, ticket routing, and lost-and-found registry.
- **3.7 Refunds System**: Automated ticket cancellation, refund calculating engine, and credit ledgers.
- **3.8 Operator Portal**: Self-serve portal for bus, taxi, and fleet operators to manage assets and schedules.

### Phase 4: Production & Launch Readiness
- **4.1 Android App**: Native mobile app wrapper with offline ticketing support.
- **4.2 iOS App**: Native iOS experience with Apple Wallet transit pass integration.
- **4.3 PWA Setup**: Offline service workers for schedules, cached tickets, and lightweight access.
- **4.4 SEO & Performance**: Dynamic server rendering for transit route pages and fast page speeds.
- **4.5 CI/CD Pipeline**: Automated test suites, linting, Docker image builds, and container scans.
- **4.6 Monitoring**: Telemetry pipelines, Prometheus metrics, and error tracing.
- **4.7 Legal & Compliance**: Data protection policies, fare rules, and transit regulatory compliance.
- **4.8 Launch & Onboarding**: Guided passenger onboarding and fleet operator activation.

---

## Architecture & Monorepo Structure

```text
MooNsTransport/
├── apps/               # Commuter web shell, operator portals, admin dashboards
├── packages/           # Shared UI primitives, DB client, routing types, config
├── services/           # Realtime telemetry, routing proxy, notification workers
├── docker-compose.yml  # Local stack orchestration
├── start.sh            # One-command local launcher for Linux/macOS
├── start.bat           # One-command local launcher for Windows
└── turbo.json          # Monorepo task pipeline configuration
```

---

## Local Development Quickstart

### Prerequisites
- Node.js 20.0.0 or higher
- Docker Desktop (for database, Redis, and services)

### Launching with Scripts
```bash
# On Linux / macOS / Git Bash:
bash start.sh

# On Windows Command Prompt:
start.bat
```

### Native Setup
```bash
# Install dependencies
npm install

# Run all applications in development mode
npm run dev

# Run linting and typechecks
npm run lint
npm run typecheck

# Run test suites
npm run test
```

---

## License & Branding Protection

Copyright &copy; 2026 **MooNs** / **MooNsTransport**. All Rights Reserved.

MooNsTransport is distributed under the **[MooNs Source-Available Community License](LICENSE)**:

1. **Forking & Local Development:** You are free to fork this repository, clone it, develop with it, and test it locally for personal and non-commercial evaluation.
2. **Preservation of Branding & Licensing:** Any fork or modification MUST retain all MooNs branding, logos, and licenses. Removing, obscuring, or stripping MooNs branding or copyright notices is **strictly illegal** and constitutes intentional copyright and trademark infringement.
3. **No Unlicensed Relicensing:** Forks cannot be relicensed under MIT, Apache, GPL, or any other permissive or alternative license.
4. **Commercial Hosting Restricted:** Multi-modal transit deployment or commercial production operations require prior written agreement from MooNs.
