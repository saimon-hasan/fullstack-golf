# CAAVON — Fullstack Storefront
> Considered essentials. Individual expression.

An e-commerce storefront demo for CIS-486 HOTEL, built with Node.js, Express, and MongoDB Atlas.

`@saimon-hasan` | `2026-10-14` | `HOTEL`

---

## 🌐 Deployments & Codebase

- **Main Code:** [main](https://github.com/saimon-hasan/fullstack-golf/tree/main)
- **PROD Deployment:** [CAAVON on GCP](http://34.44.156.54/)
- **DEV Code:** [dev](https://github.com/saimon-hasan/fullstack-golf/tree/dev)
- **DEV Deployment:** [CAAVON on Render](https://fullstack-golf.onrender.com/)
- **Development Branch:** [hotel-crud-3](https://github.com/saimon-hasan/fullstack-golf/tree/hotel-crud-3)
- **Documentation:** [docs/README.md](https://github.com/saimon-hasan/fullstack-golf/blob/main/docs/README.md)
- **CI/CD Workflow:** [deploy.yml](https://github.com/saimon-hasan/fullstack-golf/blob/main/.github/workflows/deploy.yml)

---

## 📊 HOTEL Grading Dashboard

Direct links to implementation and project-management evidence.
Code links reference the HOTEL development branch.

| Requirement | Evidence |
|---|---|
| Static frontend in public/ | [Frontend files](https://github.com/saimon-hasan/fullstack-golf/tree/hotel-crud-3/public) |
| Express backend in server/ | [Backend files](https://github.com/saimon-hasan/fullstack-golf/tree/hotel-crud-3/server) |
| MongoDB connection | [server/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/server/app.js) |
| MongoDB Node.js Driver | [server/package.json](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/server/package.json) |
| GET all | [Endpoint code](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/server/app.js) · [PROD endpoint](http://34.44.156.54/api/items) |
| GET one | [Endpoint code](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/server/app.js) |
| Filtered GET | [Query handling](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/server/app.js) |
| POST / create | [Endpoint code](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/server/app.js) |
| PATCH / update | [Endpoint code](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/server/app.js) |
| DELETE | [Endpoint code](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/server/app.js) |
| Frontend fetch() and JSON | [public/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/public/app.js) |
| Persistent CRUD demonstration | [PROD admin panel](http://34.44.156.54/#admin) |
| Secrets excluded from Git | [.gitignore](https://github.com/saimon-hasan/fullstack-golf/blob/hotel-crud-3/.gitignore) |
| HOTEL milestone | [Milestone #1](https://github.com/saimon-hasan/fullstack-golf/milestone/1) |
| Example HOTEL issue | [Issue #3](https://github.com/saimon-hasan/fullstack-golf/issues/3) |
| Development branch | [hotel-crud-3](https://github.com/saimon-hasan/fullstack-golf/tree/hotel-crud-3) |


**Earlier infrastructure evidence:** [Successful GOLF GCP deployment](https://github.com/saimon-hasan/fullstack-golf/actions/runs/34935965112). This run predates the HOTEL changes.

---

## 🏗️ Architecture

**Data flow:**

`Client → fetch() → Express REST API → MongoDB Atlas`

**Response flow:**

`MongoDB → Express → JSON → fetch() handler → DOM update`

**Development and deployment flow:**

`Issue → feature branch → PR → dev → test → PR → main → GitHub Actions → GCP`

DEV uses Render. PROD uses Nginx, Express, and PM2 on the existing GCP VM.

---

## 🔄 RESTful CRUD

| Operation | HTTP endpoint | MongoDB method |
|---|---|---|
| Create | POST /api/items | insertOne() |
| Read all | GET /api/items | find() |
| Read one | GET /api/items/:id | findOne() |
| Filter | GET /api/items?category=women | find(filter) |
| Update | PATCH /api/items/:id | updateOne() |
| Delete | DELETE /api/items/:id | deleteOne() |

POST and PATCH requests send JSON using `Content-Type: application/json`.
Identifier-based requests use the MongoDB `_id`.

**Full-stack round trip:** A user saves a product, the frontend sends POST through fetch(), Express inserts it into MongoDB, and the frontend reads the inventory again to update the page.

To demonstrate persistence, create a test product, refresh, update it, refresh again, then delete it and confirm it remains absent. Record verified DEV and PROD results in issue #3.

---

## 🔐 Security

MongoDB credentials remain server-side:

`.env → process.env.MONGODB_URI → Express → MongoDB Atlas`

The `.gitignore` excludes `.env`, environment-specific secret files, and `node_modules/`.

Never include credentials in source code, frontend JavaScript, documentation, issues, or commits.

---

## 🛠️ Local Preview

Install backend dependencies from the repository root:

```bash
npm ci --prefix server
```

Create an ignored `server/.env` containing your private `MONGODB_URI`, then start:

```bash
cd server
node app.js
```

Open http://localhost:3000.

---

## 📤 Submission

Submit one URL:

https://github.com/saimon-hasan/fullstack-golf

The grading entry point is `docs/README.md`. Merge the final changes into main, include direct evidence links, and keep the GCP VM available until grading is complete.
