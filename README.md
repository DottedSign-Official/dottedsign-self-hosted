[English](./README.md) | [繁體中文](./README.zh-TW.md)

# DottedSign Self-Hosted: Enterprise-Grade eSignature System

A self-hosted e-signature solution built for enterprises that prioritize data sovereignty.
DottedSign Self-Hosted gives enterprises the option to deploy the DottedSign system independently within their internal network environment. This offering is designed to help organizations with compliance requirements or restricted, closed-network environments build more flexible e-signature workflows.

## Key Features

- Local data storage: The system is designed to run independently within an intranet, keeping documents and signing records on your organization's private servers.
- Docker-based deployment: Provides a Docker Compose installation process to help IT teams quickly set up the environment and run proof-of-concept (POC) tests.
- Free open-source edition: This open-source version is available under a perpetual license, including core signing features and API modules with unlimited signings and users. (Note: documents signed with this edition will carry a free-tier watermark.)


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

Copy the example file and rename it to `.env`, then update the values for your environment.

```bash
cp backend.env.sapmle backend.env
```

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
| `SUPER_ADMIN` / `SUPER_ADMIN_PASSWORD` | Initial super administrator |
| `MEMBER` / `MEMBER_PASSWORD` | Initial regular user |


### Step 3: Start the services

```bash
docker compose up -d
```

Once the services are up, open your browser and navigate to `http://127.0.0.1` or `http://{env.host}` to start using DottedSign.

Default credentials can be found in `backend.env`.

Before exposing the service to any network beyond localhost, make sure to change all default passwords.


### Additional Technical Documentation

- [OpenAPI README](./openapi/README.md) — API specification and local preview
- [Configuration Reference](./docs/configuration.md) — Full environment variable reference

## API Integration Use Cases

**Embed e-signatures directly into your internal systems via API**

DottedSign Self-Hosted provides a complete REST API, allowing IT teams to embed e-signature workflows into existing business systems without requiring users to switch platforms.

**Common integration scenarios**

| Department | Example |
| --- | --- |
| Legal | Automatically trigger a signing workflow after contract review; both parties complete signing online. |
| Procurement | After a PO is submitted in the procurement system, use the API to initiate electronic approval from suppliers. |
| Travel | Automatically generate and send insurance contracts to customers for signing after an order is placed. |
| HR | On a new employee's first day, the HR system automatically sends an onboarding document package (employment contract, NDA, etc.). |

With the API, you can:
- Initiate signing tasks: specify signers, field positions, and expiration times.
- Track status in real time: monitor the signing progress of every document.
- Auto-archive: automatically retrieve the signed PDF and store it in your document management system.


## Enterprise Adoption and Case Studies

DottedSign has extensive enterprise service experience, offering technical compliance and reliability references for organizations evaluating a Self-Hosted solution:

- Market traction: Serving over 4,200 businesses globally, with more than 1 million users worldwide.
- Large-scale manufacturing: Driving ESG paperless initiatives and accelerating internal compliance processes with digital signatures.
- Multinational travel group: Digitizing travel contracts for a low-carbon signing experience.
- Major financial securities firm: Adopting video-based e-signatures to enable new fintech applications.
- Retail / chain group: Full paperless processing of over 1,000 HR documents per year.
- Listed technology company: Streamlining external e-commerce business processes.
- Leading travel e-commerce platform: Combined with RPA automation, recruitment contracts are signed back within 1 day.

👉 [View more customer stories](https://www.dottedsign.com/en/blog/category/client-story)

## Advanced Features and Commercial Licensing

The current open-source edition covers the core signing workflow. If your organization requires any of the following:

1. Unlock advanced security modules: such as legally binding document certificates, Email OTP, SMS OTP, and more.
2. Custom development and deep integration: need to deeply integrate the system, or prefer not to be subject to the AGPL-3.0 open-source terms.

👉 Contact [DottedSign Sales](https://www.dottedsign.com/en/request-demo/?help=inquiry_enterprise_plan) to inquire about commercial licensing options and pricing.

## AGPL-3.0 Open-Source License and Notes

This open-source version is released under the **AGPL-3.0 license**.
- If your organization installs and uses this software internally only and has not modified the source code, you are not subject to the open-source disclosure requirements.
- If you modify the source code (e.g., customize the UI) and provide the modified system as a service to third parties, you are required under the license to release the modified source code. If you need to keep customizations proprietary, we recommend inquiring about a commercial license.

## Support

- Open-source technical discussion: For deployment issues, please open a [GitHub Issue](https://github.com/DottedSign-Official/dottedsign-self-hosted/issues) so the community can assist.
- Commercial licensing and service support: Licensed customers receive SLA-backed support equivalent to the SaaS standard. Contact the sales team for details.
