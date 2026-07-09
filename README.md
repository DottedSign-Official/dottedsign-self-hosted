[English](./README.md) | [繁體中文](./README.zh-TW.md)

# DottedSign Self-Hosted: Enterprise-Grade eSignature System

[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-4b5fe6)](./LICENSE) ![Deploy: Docker Compose](https://img.shields.io/badge/deploy-Docker%20Compose-2496ed?logo=docker&logoColor=white)

*Self-host DottedSign with Docker Compose — your data, your server.*

![DottedSign Self-Hosted — your data, your server, full eSignature workflow](./docs/assets/dottedsign-self-hosted-overview.png)

**Trusted by 4,200+ businesses and 1M+ users worldwide.** DottedSign Self-Hosted lets enterprises that prioritize data sovereignty run the full DottedSign signing system independently — inside their own network or on their preferred cloud. It's built for organizations with compliance requirements or closed-network environments that need a flexible eSignature workflow they fully control.Open source DocuSign alternative.

## Key Features

- Data sovereignty: Documents and signing records live on your organization's own servers — not on a third party's infrastructure. Full custody, full control over access and retention.
- Docker-based deployment: Provides a Docker Compose installation process to help IT teams quickly set up the environment and run proof-of-concept (POC) tests.
- Free open-source edition: This open-source version is available under a perpetual license, including core signing features and API modules with unlimited signings and users. (Note: Documents signed with this edition will include an embedded free-tier identifier code)
- Deploy anywhere: One Docker Compose stack, your choice of environment — your own servers, or the cloud you already use (AWS, GCP, Azure, Snowflake). Move between them without changing how it runs.


## Quick Start

### Prerequisites

- Docker 20+
- Docker Compose v2
- 8 GB RAM recommended (covers Postgres, Redis, backend, worker, frontend, and nginx)

### Step 1: Clone the repository

```bash
git clone https://github.com/DottedSign-Official/dottedsign-self-hosted.git dottedsign-self-hosted
cd dottedsign-self-hosted
```


### Step 2: Configure environment variables

Copy the example files and rename them to `backend.env` / `frontend.env`, then update the values for your environment.

```bash
cp backend.env.sample backend.env
cp frontend.env.sample frontend.env
```

`frontend.env` must stay in sync with `backend.env`: `AUTH_CLIENT_ID` and
`AUTH_CLIENT_SECRET` must be identical in both files — the backend seeds this
OAuth client at first boot, and the frontend uses the same pair to obtain
tokens. Whenever you change them in one file, change the other. `BACKEND_HOST`
defaults to the backend service name inside Docker Compose and normally does
not need to be changed.

Full reference (each variable, default value, and whether it is required) is available at
[`docs/configuration.md`](./docs/configuration.md).

Required variables to start the service:

| Variable | Purpose |
| --- | --- |
| `DATABASE_HOST` / `DATABASE_PORT` / `DATABASE_NAME` / `DATABASE_USERNAME` / `DATABASE_PASSWORD` | PostgreSQL connection |
| `REDIS_HOST` | Redis connection |
| `SERVER_HOST` / `WEB_BRANCH_DEEPLINK` | Public-facing service URL |
| `JWT_SECRET` | JWT signing key |
| `OTP_KEY` | OTP key |
| `RECORD_ENCRYPTION_KEY` | Encryption key for sensitive database fields |
| `SUPER_ADMIN` / `SUPER_ADMIN_PASSWORD` | Initial super administrator |
| `MEMBER` / `MEMBER_PASSWORD` | Initial regular user |

#### Generate your own secrets (important)

`JWT_SECRET` and `OTP_KEY` ship empty in `backend.env.sample`. If you leave
them empty or reuse the sample values, the service falls back to defaults that
are publicly visible in this open-source repository — effectively a known weak
key that lets anyone forge tokens or one-time passwords. Always generate your
own values before any real deployment:

```bash
openssl rand -hex 32   # JWT_SECRET
openssl rand -hex 32   # OTP_KEY
openssl rand -hex 16   # RECORD_ENCRYPTION_KEY (32 hex characters)
```

`AUTH_CLIENT_ID` and `AUTH_CLIENT_SECRET` in the sample files are example
values only. For the same reason, replace them with your own randomly
generated values (e.g. `openssl rand -hex 32`) before production use — and
remember to set the same pair in both `backend.env` and `frontend.env`.


### Step 3: Start the services

```bash
docker compose up -d
```

Once the services are up, open your browser and navigate to `http://127.0.0.1` or `http://{env.host}` to start using DottedSign.

Default credentials can be found in `backend.env`.

#### Before exposing the service beyond localhost

The Quick Start defaults are for local proof-of-concept only. Before any
deployment reachable by other people, go through this checklist:

- Change all default passwords: `SUPER_ADMIN_PASSWORD`, `MEMBER_PASSWORD`, and
  `SIDEKIQ_USER_NAME` / `SIDEKIQ_PASSWORD` — the bundled nginx routes the
  `/sidekiq` admin dashboard publicly, protected only by these basic-auth
  credentials.
- `DATABASE_PASSWORD` must be changed together with `POSTGRES_PASSWORD` in
  `docker-compose.yml` (they must match), and `REDIS_PASSWORD` should be set
  if Redis is reachable beyond the internal compose network.
- `OPENSSL_PASS` in the sample file is publicly known, so the bundled `*.enc`
  config files it protects should be treated as public. To use your own
  passphrase, re-encrypt first with `rake config:encrypt_files`, then update
  `OPENSSL_PASS` — changing only the variable makes the service fail to boot.
- Set `RAILS_ENV=production`.


#### Auto-generated secrets and data persistence

On first boot the backend automatically generates per-install secrets
(`rake config:bootstrap_secrets`):

- `backend/config/master.key` / `backend/config/credentials.yml.enc` — Rails credentials
- `backend/config/on_premise_rsa/password/` — RSA key pair used to encrypt/decrypt the `CRYPTO_*` password values

If you want to keep or reuse these secrets, mount the corresponding files or
directories as volumes so they survive container rebuilds.

The bundled `docker-compose.yml` is a minimal example: it mounts the whole
`./backend` directory, which keeps the generated keys and uploaded documents
(`backend/tmp/storage`) on the host. Adjust it to your deployment needs —
for example where document storage and the password RSA key pair (the `.pem`
files under `backend/config/on_premise_rsa/password`) are stored and mounted.
If you switch to pre-built images without the source mount, be sure to mount
those paths (and the PostgreSQL data directory) as volumes, otherwise the
generated keys and data are lost when containers are rebuilt.


### Additional Technical Documentation

- [OpenAPI README](./openapi/README.md) — API specification and local preview
- [Configuration Reference](./docs/configuration.md) — Full environment variable reference

## API Integration Use Cases

**Embed eSignatures directly into your internal systems via API**

DottedSign Self-Hosted provides a complete REST API, allowing IT teams to embed eSignature workflows into existing business systems without requiring users to switch platforms.

**Common integration scenarios**

| Industry / Role | Use Case |
| --- | --- |
| Legal | Once legal contract review is complete, the signing workflow is automatically triggered, and both parties complete e-sealing online.Applicable Systems: CLM (Contract Lifecycle Management) systems, e.g., Ironclad, Icertis, Conga. |
| Travel | Once an order is placed, an insurance contract is automatically generated and sent to the customer for signature.Applicable Systems: Travel platform order management systems. |
| HR | On a new employee's first day, the HR system automatically sends onboarding documents for signature (labor contract, NDA, etc.).Applicable Systems: HRM (Human Resource Management) systems. |
| Healthcare | Surgical consent forms are signed online, with results saved back to the patient's medical record.Applicable Systems: HIS (Hospital Information System), EMR (Electronic Medical Record) systems.). |
| Business | A sales contract is automatically generated and sent to the customer for signature; once signed, the deal status is written back.Applicable Systems: CRM systems, e.g., Salesforce, HubSpot, Pipedrive. |

With the API, you can:
- Initiate signing tasks: specify signers, field positions, and expiration times.
- Track status in real time: monitor the signing progress of every document.
- Auto-archive: automatically retrieve the signed PDF and store it in your document management system.


## Self-Hosted or SaaS — Which Fits You?

Both run the same DottedSign signing experience. The difference is **where your data lives and who maintains it**.

| | Self-Hosted (this repo) | SaaS |
| --- | --- | --- |
| Where data lives | Your own server — intranet, or your cloud (AWS / GCP / Azure / Snowflake) | DottedSign-managed cloud |
| Best for | Data-sovereignty / compliance needs, closed-network environments | Teams who want to start signing right away with zero setup |
| Deployment | You deploy via Docker Compose | Nothing to deploy — sign up and go |
| Maintenance & updates | Managed by your IT team | Handled by DottedSign |
| License | Open-source AGPL-3.0 (perpetual); commercial license available | Subscription plan |
| Advanced security modules | Available via commercial license (e.g. approved digital certificates, Email / SMS OTP) | Included per plan |

Not sure which path fits? [Talk to the DottedSign team](https://www.dottedsign.com/request-demo/).

## FAQ

### Is the open-source edition really free?

Yes. It's released under AGPL-3.0 with a perpetual license, and includes core signing features and API modules with unlimited signings and users. Documents signed with this edition carry an embedded free-tier identifier code.

### Can I deploy it on the cloud, not just my own servers?

Yes. The same Docker Compose stack runs inside your intranet or on the cloud you already use — AWS, GCP, Azure, or Snowflake.

### What do I need to get started?

Docker 20+, Docker Compose v2, and 8 GB RAM recommended (covers Postgres, Redis, backend, worker, frontend, and nginx). See the Quick Start above.

### What's the difference between the open-source edition and the commercial license?

The open-source edition covers the core signing workflow. The commercial license unlocks advanced security modules (e.g. approved digital certificates, Email OTP, SMS OTP), organization role & permission management via the Admin Console, and deep integration / custom development without the AGPL-3.0 disclosure terms.

### Does AGPL-3.0 apply if I only use it internally?

If your organization installs and uses the software internally — without distributing it externally or offering it as a service to third parties over a network — you are not subject to the open-source disclosure requirements. If you modify the source and offer it as a service to third parties, the modified source must be made available under AGPL-3.0. For proprietary customizations, ask about a commercial license.

### How do I get support?

For deployment questions, open a GitHub Issue so the community can help. Licensed customers receive SLA-backed support equivalent to the SaaS standard — [contact the sales team](https://www.dottedsign.com/request-demo/?help=inquiry_enterprise_plan) for details.


## Enterprise Adoption and Case Studies

DottedSign has extensive enterprise service experience, offering technical compliance and reliability references for organizations evaluating a Self-Hosted solution:

- Market traction: Serving over 4,200 businesses globally, with more than 1 million users worldwide.
- Large-scale manufacturing: Driving ESG paperless initiatives and accelerating internal compliance processes with digital signatures.
- Multinational travel group: Digitizing travel contracts for a low-carbon signing experience.
- Major financial securities firm: Adopting video-based eSignatures to enable new fintech applications.
- Retail / chain group: Full paperless processing of over 1,000 HR documents per year.
- Listed technology company: Streamlining external e-commerce business processes.
- Leading travel e-commerce platform: Combined with RPA automation, recruitment contracts are signed back within 1 day.

👉 [View more client success cases](https://www.dottedsign.com/en/blog/category/user-story)

## Advanced Features and Commercial Licensing

The current open-source edition covers the core signing workflow. If your organization requires any of the following:

1. Unlock advanced security modules: such as legally binding document certificates, Email OTP, SMS OTP, and more.
2. Custom development and deep integration: need to deeply integrate the system, or prefer not to be subject to the AGPL-3.0 open-source terms.

👉 Contact [DottedSign Sales](https://www.dottedsign.com/en/request-demo/?help=inquiry_enterprise_plan) to inquire about commercial licensing options and pricing.

## AGPL-3.0 Open-Source License and Notes

This open-source version is released under the **AGPL-3.0 license**.
- If your organization installs and uses this software internally only, without distributing it externally or providing it as a service to third parties over a network, you are not subject to the open-source disclosure requirements.
- If you modify the source code (e.g., customize the UI) and provide the modified system as a service to third parties, you are required to make the modified source code available under AGPL-3.0. If you need to keep customizations proprietary, we recommend inquiring about a commercial license.

## Support

- Open-source technical discussion: For deployment issues, please open a GitHub Issue so the community can assist.
- Commercial licensing and service support: Licensed customers receive SLA-backed support equivalent to the SaaS standard. Contact the sales team for details.
