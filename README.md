# CAAVON — Fullstack Storefront
> Considered essentials. Individual expression.

A professional e-commerce storefront demo for CIS-486 HOTEL, built with Node.js, Express, and MongoDB Atlas.

`@saimon-hasan` | `2026-10-13` | `HOTEL`

---

## 🌐 Deployments & Codebase
- **Main Code:** [GitHub Repository](https://github.com/saimon-hasan/fullstack-golf)
- **PROD Deployment:** [http://34.44.156.54/](http://34.44.156.54/)
- **DEV Deployment:** [https://fullstack-golf.onrender.com/](https://fullstack-golf.onrender.com/)
- **CI/CD Workflow:** [GitHub Actions Tab](https://github.com/saimon-hasan/fullstack-golf/actions)

---

## 📊 HOTEL Grading Dashboard
*This section provides direct evidence for the assignment requirements.*

| Requirement | Evidence (Direct Link to Code/Issue) |
|---|---|
| **MongoDB connection** | [server/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/hotel/server/app.js) |
| **GET all** | [server/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/hotel/server/app.js) |
| **GET one** | [server/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/hotel/server/app.js) |
| **filtered GET** | [server/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/main/server/app.js#L22) |
| **POST / create** | [server/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/main/server/app.js#L41) |
| **PATCH / update** | [server/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/main/server/app.js#L51) |
| **DELETE** | [server/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/main/server/app.js#L63) |
| **frontend `fetch()`** | [public/app.js](https://github.com/saimon-hasan/fullstack-golf/blob/main/public/app.js#L20) |
| **persistent CRUD** | [Live Site Admin Panel](http://34.44.156.54/#admin) |
| **PROD deployment** | [Successful GitHub Action Run](https://github.com/saimon-hasan/fullstack-golf/actions/runs/34935965112) |

---

## 🏗️ Architecture
**Data Flow:** 
`Client (Browser) → fetch() → Express REST API → MongoDB Atlas`

**Deployment Flow:** 
`Feature Branch → PR → dev → PR → main → GitHub Actions → GCP`

## 🛠️ Local Preview
```bash
npm install
node server/app.js
