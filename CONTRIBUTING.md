# Contributing to MooNsTransport

Thank you for your interest in contributing to **MooNsTransport**! We welcome bug fixes, documentation improvements, transit routing algorithms, and local testing enhancements.

[📖 README](README.md) · [🤝 Code of Conduct](CODE_OF_CONDUCT.md) · [👥 Contributing](CONTRIBUTING.md) · [⚖️ License](LICENSE) · [🛡️ Security](SECURITY.md)

---

## 1. Licensing & Branding Rules for Contributors

Please review [LICENSE](LICENSE) before contributing:
- **Local Development & Non-Commercial Evaluation**: MooNsTransport is distributed under the *MooNs Source-Available Community License*.
- **Branding Preservation**: Any contribution, fork, or PR must preserve all MooNs logos, copyright notices, and branding marks. Sublicensing or stripping brand assets is strictly prohibited and illegal.
- **Contribution Ownership**: By submitting a pull request, you agree that your contribution is provided under the same license terms for incorporation into the MooNs project.

---

## 2. Zero-Confidentiality Policy

> [!IMPORTANT]
> **Never commit confidential information.**
> Do NOT submit real user names, phone numbers, payment credentials, `.env` files, production API keys, or live telemetry database dumps. Use synthetic seed data and environment variables exclusively.

---

## 3. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/schowdary75/MooNsTransport.git
cd MooNsTransport

# Install dependencies with Turborepo
npm install

# Run the complete dev stack
npm run dev

# Run linting and type checks
npm run lint
npm run typecheck
```
