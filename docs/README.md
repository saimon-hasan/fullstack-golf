# CAAVON

> Considered essentials. Individual expression.

CAAVON is a clothing storefront demo with Women’s and Men’s collections, search, category filters, price sorting, product details, size selection, favorites, and a shopping bag. Demo sign-in and checkout let visitors explore the experience without creating a real account or making a payment.

### Authorship + version

`@saimon-hasan` | `2026-09-15` | `GOLF`

Built for CIS-486. The storefront brand is **CAAVON**; the repository remains **fullstack-golf**.

### Deployments, codebase, & repo features

| Resource | Link / status |
| --- | --- |
| PROD codebase | [`main`](https://github.com/saimon-hasan/fullstack-golf/tree/main) |
| PROD server | [GCP — CAAVON](http://34.44.156.54/) |
| DEV codebase | [`dev`](https://github.com/saimon-hasan/fullstack-golf/tree/dev) |
| DEV server | [Render — CAAVON](https://fullstack-golf.onrender.com/) |
| Docs | [`docs/`](https://github.com/saimon-hasan/fullstack-golf/tree/main/docs) |
| Published docs | **Pending:** enable GitHub Pages from `main` → `/docs`, then add the verified published URL |
| CI/CD workflow | [`deploy.yml`](https://github.com/saimon-hasan/fullstack-golf/blob/main/.github/workflows/deploy.yml) |
| Successful PROD deployment | [GitHub Actions run — CAAVON branding correction](https://github.com/saimon-hasan/fullstack-golf/actions/runs/34935965112) |
| Resolved GOLF issue | [Issue #1 — Render did not automatically deploy dev updates](https://github.com/saimon-hasan/fullstack-golf/issues/1) |
| PROD health | [`/api/health`](http://34.44.156.54/api/health) |
| DEV health | [`/api/health`](https://fullstack-golf.onrender.com/api/health) |

The successful run above deployed commit [`ad561dd`](https://github.com/saimon-hasan/fullstack-golf/commit/ad561dd6829a09795f2fed28ee36ba73ac182253). The visible change is the **CAAVON** brand in the logo, page titles, sign-in page, and product details. Both deployments were verified to serve the updated files and return `{"status":"ok"}` from the health endpoint.

### User story

- **As a** burgeoning full-stack developer,
- **I want** a CI/CD infrastructure,
- **so that** I can develop locally, manage my code in GitHub, and automatically deploy changes to DEV and PROD environments.

### Narrative

I built CAAVON, a clothing storefront demo served by Node.js and Express, and developed it locally on my MacBook. Pushing to `dev` automatically deploys the app to Render, while pushing to `main` triggers GitHub Actions to update the GCP virtual machine through SSH. On GCP, Nginx forwards web requests to Express, and PM2 manages the Node.js process with startup configured for system reboots. The storefront and both deployment pipelines work; instructor SSH access has been added, while the assigned PROD subdomain, HTTPS, and published documentation remain pending.

### Architecture

```text
LOCAL — MacBook / VS Code
  |
  v
GitHub — saimon-hasan/fullstack-golf
  |
  +-- dev  --> Render --------------------------> DEV
  |
  +-- main --> GitHub Actions --> SSH --> GCP ---> PROD
                                           |
                                  Nginx :80
                                           |
                                  Express :3000
                                  managed by PM2
```

### Stack

`HTML/CSS/JS` | `Node.js` | `Express` | `Git/GitHub` | `Render` | `GCP` | `Linux` | `Nginx` | `PM2` | `GitHub Actions`

**Pending:** `Certbot` for PROD HTTPS after the assigned domain is configured.

The frontend loads its sample catalog from JSON and stores the demo username, favorites, and bag in `sessionStorage` for the current browser tab. It does not use a customer database, process payments, or provide production authentication.

### Project structure

Actual project files, excluding `.git/`, `node_modules/`, and operating-system metadata:

```text
fullstack-golf/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/
│   └── README.md
├── public/
│   ├── app.js
│   ├── index.html
│   ├── login.html
│   ├── products.json
│   └── styles.css
├── server/
│   ├── app.js
│   ├── package-lock.json
│   └── package.json
├── .gitignore
└── README.md
```

To regenerate a tree listing when the `tree` utility is installed, run this from the repository root:

```bash
tree -a -I '.git|node_modules|.DS_Store'
```

### GCP

| Setting | Value |
| --- | --- |
| External IP | `34.44.156.54` |
| Address reservation | `fullstack-golf-ip` — static |
| VM | `instance-20260908-181951` |
| Zone | `us-central1-a` |
| Linux user | `saimon_hasan1997` |
| Operating system | Debian GNU/Linux 13 |
| Application directory | `/home/saimon_hasan1997/fullstack-golf/server` |
| PM2 process | `fullstack-golf` |
| Instructor SSH public key installed | **Yes — confirmed by the project owner** |
| Assigned PROD subdomain | **Pending instructor confirmation** |
| PROD HTTPS | **Pending domain configuration and Certbot setup** |

`cavoon.com` is the desired domain displayed in the storefront. It is **not connected to this deployment**. The currently working PROD address is the GCP IP shown above.

### Run locally

From the repository root:

```bash
npm ci --prefix server
npm start --prefix server
```

Open [http://localhost:3000](http://localhost:3000). For the sign-in demo, choose any username and use the displayed demo password **`cavoon123`**. This is a public classroom demonstration value, not a private credential. No password is stored in the browser session.

### Deployment workflow

1. Develop and commit changes on `dev`.
2. Push `dev` to GitHub and verify the Render deployment.
3. Merge reviewed changes into `main` and push.
4. Verify the GitHub Actions run, the visible PROD change, and `/api/health`.

The GCP workflow verifies the SSH host fingerprint, updates the VM’s `main` checkout, installs dependencies with `npm ci`, restarts and saves the PM2 process, and checks health through both Express and Nginx. Deployment credentials are stored in GitHub Actions secrets, not in this repository.

### Verification completed

- Tested demo sign-in with incorrect and correct passwords, plus sign-out.
- Tested search, category filtering, price sorting, and empty results.
- Tested saving and removing favorites.
- Tested product size selection, bag quantities, totals, session persistence across refresh, and demo checkout.
- Checked desktop and mobile layouts, including horizontal overflow.
- Checked JavaScript syntax and Git whitespace errors.
- Verified that `node_modules/` is ignored and is not tracked by Git.
- Verified DEV and PROD branding files against the local deployment files and checked both health endpoints.

The existing `npm test` script is still the generated placeholder; the checks listed above do not claim a passing automated test suite or full accessibility certification.

### References & attribution

- [Express](https://expressjs.com/), [Nginx](https://nginx.org/), [PM2](https://pm2.keymetrics.io/), [Render](https://render.com/docs), and [GitHub Actions](https://docs.github.com/en/actions) support the application and deployment stack.
- Storefront photographs are served from [Unsplash](https://unsplash.com/) and are illustrative, not photographs of inventory offered for sale. Image URLs are recorded in `public/products.json`, `public/app.js`, and `public/styles.css`.
- Typography uses Google Fonts: DM Sans and Manrope.
- Classmate [BlushBasket](https://github.com/poppydalton/project-blush-basket-shop) and [BookNook](https://fullstack-booknook.onrender.com/) were reviewed as feature references. CAAVON uses its own branding and implementation.
- [Birdwatching Simulator](https://github.com/edmullins/Birdwatching-Simulator) was reviewed as a reference for README organization and assignment documentation.
- OpenAI Codex assisted with implementation, troubleshooting, documentation, and verification. The storefront style was inspired by minimal clothing retail layouts, including H&M; CAAVON is not affiliated with H&M.

### Grading checkpoints

- [x] Repository uses `public/` + `server/`; `node_modules/` is not committed.
- [x] Push to `dev` automatically deploys to Render DEV.
- [x] Push to `main` triggers GitHub Actions and deploys to GCP PROD.
- [ ] PROD uses the assigned subdomain + HTTPS.
- [x] Nginx reverse proxy + PM2 are running, as verified during deployment.
- [x] A successful PROD GitHub Action is linked and its change is visible on PROD.
- [x] One real GOLF problem is documented in a closed GitHub Issue.
- [x] Instructor SSH public key is installed (confirmed by the project owner).
- [ ] GitHub Pages documentation is published and its link verified.
- [ ] GCP VM remains running from submission until graded — ongoing responsibility.

### Submission

Submit this repository URL: **https://github.com/saimon-hasan/fullstack-golf**

Keep the GCP VM running until grading is complete. Never commit passwords, private keys, repository secrets, or `.env` values.
