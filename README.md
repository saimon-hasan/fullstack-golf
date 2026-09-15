# CAAVON

> Considered essentials. Individual expression.

A clothing storefront demo for CIS-486 GOLF, built with Node.js and Express and deployed to Render DEV and GCP PROD.

## Project documentation

**[Open the project landing page and grading dashboard](docs/README.md)** for the architecture, setup instructions, deployment evidence, project structure, and remaining requirements.

## Deployments

- [DEV — Render](https://fullstack-golf.onrender.com/)
- [PROD — GCP](http://34.44.156.54/)
- [Successful PROD deployment](https://github.com/saimon-hasan/fullstack-golf/actions/runs/34935965112)

The brand is **CAAVON**. `cavoon.com` is the desired domain and is not yet connected. PROD currently uses its GCP IP; the assigned subdomain and HTTPS are pending.

## Local preview

```bash
npm ci --prefix server
npm start --prefix server
```

Open [localhost:3000](http://localhost:3000). Demo sign-in accepts any username with the public demo password `cavoon123`. No real accounts, orders, or payments are created.
