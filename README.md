<h1 align="center">🍔 ZOMOREELS</h1>
<h3 align="center">A Zomato-Inspired Full-Stack Food Discovery Platform with Reel-Style Short Video Feed</h3>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/ImageKit-Media_CDN-FF6A00?style=for-the-badge" />
  <img src="https://img.shields.io/badge/JWT-HttpOnly_Cookies-000000?style=for-the-badge&logo=jsonwebtokens" />
  <img src="https://img.shields.io/badge/Status-Under_Development-orange?style=for-the-badge" />
</p>

---

## 📖 What Is This Project?

**ZOMOREELS** is a full-stack food discovery web app built from scratch, inspired by Zomato's restaurant discovery experience combined with the short-video feed concept from Instagram Reels / TikTok.

The core idea: instead of browsing a static food menu, users scroll through **full-screen short video reels** of food items uploaded by restaurants — making food discovery more visual and engaging.

The platform has **two separate roles**:

| Role | Who They Are | What They Can Do |
|---|---|---|
| 👤 **User** | A regular food-lover | Browse restaurants, watch food reels, like & save reels, visit restaurant profiles |
| 🍽️ **Food Partner** | A restaurant / food business | Register business, upload food videos, manage profile & avatar, set restaurant background image |

---

## ✨ Features

### For Users
- 🏠 **Landing Page** — See all registered restaurants with their background images, name, contact, and address. Click any card to open the restaurant's public profile
- 🔍 **Restaurant Search** — Filter restaurants by name in real time
- 🎥 **Reel-Style Video Feed** — Scroll through food videos fullscreen (like Instagram Reels), with scroll-snap between each video
- ❤️ **Like Reels** — Tap the heart to like/unlike a food reel; count is stored in the database and updates via optimistic UI
- 🔖 **Save Reels** — Bookmark any food reel; saved reels are fetched per-user from the database
- 🗂️ **Bottom Navigation** — Home tab (all reels) and Saved tab (your bookmarked reels) accessible from the feed
- 🏪 **Public Restaurant Profile** — View a restaurant's info, stats, and all their reels from a user's perspective
- 🔒 **Auth-Gated Content** — Restaurant reels and order buttons are only visible to logged-in users; guests see a login prompt
- 🔐 **Secure Auth** — Register & login, session maintained via HttpOnly JWT cookie

### For Food Partners
- 📋 **Restaurant Registration** — Full business onboarding (restaurant name, contact person, phone, address, email)
- 🎬 **Food Reel Upload** — Upload food item videos with a name, description, and tags — stored on ImageKit CDN
- 🖼️ **Background Image Upload** — Upload a restaurant cover image that shows on the public landing page (from the dashboard)
- 🖼️ **Avatar / Profile Picture** — Food partners can upload, change, or remove their profile picture from a popup menu on their profile page
- 📊 **My Reels Dashboard** — View all uploaded food reels in one place
- 👤 **Food Partner Profile Page** — A dedicated profile page shown after login, with reels grid, restaurant stats, and avatar management
- 🔐 **Separate Authenticated Session** — Role-specific login, isolated from user sessions

### Design & UX
- 📱 **Fully Responsive** — Layout adjusts for desktop, tablet, and mobile (breakpoints: 768px, 480px)
- 🎨 **CHOMP Aesthetic** — Sharp borders, stark box shadows, vibrant orange (`#FF5A36`), cream background, uppercase typography
- 🌙 **Dark Mode** — Automatic via `prefers-color-scheme` media query
- ✨ **Micro-animations** — Button press effects, card hover lifts, frosted-glass action buttons on reels, smooth transitions globally

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Role in Project |
|---|---|---|
| **React** | 19.x | Core UI framework, component-driven architecture |
| **Vite** | 7.x | Blazing-fast dev server & production bundler |
| **React Router DOM** | 7.x | Declarative client-side routing for all pages |
| **Axios** | 1.x | HTTP client — all API calls go through a centralized `axiosInstance` with `withCredentials: true` for cookie support |
| **Vanilla CSS** | — | Custom per-page CSS, no CSS frameworks; theme tokens in `theme.css` |

### Backend
| Technology | Version | Role in Project |
|---|---|---|
| **Node.js** | — | JavaScript runtime |
| **Express** | 5.x | Web framework — defines routes, middleware chain, and API handlers |
| **MongoDB** | — | NoSQL database storing users, food partners, food items, likes, and saves |
| **Mongoose** | 9.x | Schema validation and ODM; defines `User`, `FoodPartner`, `Food`, `Like`, and `Save` models |
| **JWT** | 9.x | Issues signed tokens on login — verified on every protected request |
| **bcryptjs** | 3.x | Hashes passwords before saving (`salt rounds = 10`) |
| **Multer** | 2.x | Handles `multipart/form-data` for video & image uploads; uses in-memory buffer storage |
| **cookie-parser** | 1.x | Parses cookies from incoming requests so middleware can read JWT |
| **UUID** | 13.x | Generates unique filenames before uploading to ImageKit (prevents collision) |
| **Zod** | 3.x | Schema-based input validation on every POST endpoint — rejects malformed/missing data before it hits the controller |
| **CORS** | 2.x | Allows requests from the configured frontend origin (`FRONTEND_URL` env var) with cookies |
| **dotenv** | 17.x | Loads `.env` variables at startup |
| **nodemon** | 3.x | Auto-restarts backend during development |

### Cloud / Media
| Service | Purpose |
|---|---|
| **ImageKit** | Media CDN — videos uploaded as base64, stored as `.mp4`; images stored as `.jpg`. Returns a public CDN URL saved in MongoDB |
| **MongoDB Atlas** *(or local)* | Cloud database hosting |

---

## 🏗️ How The Project Is Structured

```
Zomato-app/
│
├── backend/                           ← Express REST API Server
│   ├── server.js                      ← Entry point: loads .env, connects DB, starts server on port 3002
│   └── src/
│       ├── app.js                     ← Express app setup: registers middleware & mounts routes
│       ├── controllers/               ← Business logic (the "brain" of each route)
│       │   ├── auth.controllers.js    ← Register/Login/Logout for Users & FoodPartners; image upload; getUserMe
│       │   └── food.controllers.js    ← Upload reel, get reels, get partner reels, like/unlike, save/unsave,
│       │                                 get saved items, public restaurant profile by ID
│       ├── middlewares/
│       │   ├── authFP.middleware.js   ← JWT auth guards: authFoodPartnerMiddleware & authUserMiddleware
│       │   │                            Handles TokenExpiredError separately — clears stale cookie, returns 401
│       │   └── validate.middleware.js ← Reusable validate(schema) factory — runs Zod schemas before controllers
│       ├── models/                    ← Mongoose schemas (define DB structure)
│       │   ├── user.models.js         ← User: fullname, email, hashed password
│       │   ├── foodpartner.models.js  ← FoodPartner: fullname, contact, phone, address, email, password, image URL
│       │   ├── food.models.js         ← Food item: foodname, video URL, description, tags, likeCount, ref → FoodPartner
│       │   ├── likes.models.js        ← Like: user (ref) + food (ref) — toggle like/unlike per user per reel
│       │   └── save.models.js         ← Save: user (ref) + food (ref) — bookmarks per user
│       ├── routes/                    ← Route definitions (URL → controller mapping)
│       │   ├── auth.routes.js         ← /api/auth/* (login, register, logout, image upload, user check)
│       │   └── food.routes.js         ← /api/food/* (upload, fetch, like, save, saved, public restaurant)
│       ├── services/
│       │   └── storage.services.js    ← ImageKit integration: fileUpload() for videos, imageUpload() for images
│       ├── validators/
│       │   └── validators.js          ← Zod schemas for every POST body (6 schemas total)
│       └── db/
│           └── db.js                  ← Mongoose connection to MongoDB
│
└── frontend/                          ← React 19 + Vite SPA
    └── src/
        ├── main.jsx                   ← ReactDOM render root
        ├── App.jsx                    ← Root component — renders <AppRoutes />
        ├── api/
        │   └── axiosInstance.js       ← Centralized Axios instance (baseURL + withCredentials)
        ├── routes/
        │   └── AppRoutes.jsx          ← All client-side routes defined here using React Router
        ├── pages/
        │   ├── auth/                  ← UserLogin, UserRegister, FoodPartnerLogin, FoodPartnerRegister
        │   ├── general/               ← LandingPage, UserHome (reel feed + bottom nav), UserProfile,
        │   │                             RestaurantProfile (public, auth-gated reels)
        │   └── food-partner/          ← Profile (avatar management + reels grid),
        │                                FoodPartnerHome (dashboard: upload reels + background image)
        └── styles/                    ← Per-page CSS files + theme.css (global tokens & resets)
```

---

## 🔗 How Files Connect — The Full Request Flow

### System Architecture

```mermaid
graph TD
    Browser["🌐 Browser (React SPA)"]
    ViteServer["⚡ Vite Dev Server\nlocalhost:5173"]
    ExpressApp["🖥️ Express App\nlocalhost:3002"]
    MongoDB["🍃 MongoDB\n(Atlas / Local)"]
    ImageKit["☁️ ImageKit CDN"]

    Browser -->|HTTP Requests via Axios| ExpressApp
    Browser --> ViteServer
    ViteServer -->|Serves React bundles| Browser
    ExpressApp -->|Mongoose queries| MongoDB
    ExpressApp -->|Base64 upload| ImageKit
    ImageKit -->|Returns CDN URL| ExpressApp
    MongoDB -->|Document data| ExpressApp
    ExpressApp -->|JSON Response| Browser
```

---

### Backend Boot Sequence

```mermaid
flowchart LR
    A["server.js\n(Entry Point)"] -->|"require dotenv"| B["Loads .env vars"]
    A -->|"require app.js"| C["app.js\n(Express setup)"]
    A -->|"connectDB()"| D["db.js\n(MongoDB connect)"]
    C -->|"app.use CORS"| E["Allow localhost:5173\nwith credentials"]
    C -->|"app.use cookieParser"| F["Parse JWT from cookies"]
    C -->|"app.use /api/auth"| G["auth.routes.js"]
    C -->|"app.use /api/food"| H["food.routes.js"]
    A -->|"app.listen(3002)"| I["🚀 Server Running"]
```

---

### Authentication Flow (Login → Protected Request)

```mermaid
sequenceDiagram
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant DB as MongoDB
    participant MW as authFP.middleware.js

    FE->>BE: POST /api/auth/foodpartner/login {email, password}
    BE->>DB: foodpartnerModel.findOne({ email })
    DB-->>BE: FoodPartner document
    BE->>BE: bcrypt.compare(password, hash)
    BE->>BE: jwt.sign({ id: partner._id }, JWT_SECRET)
    BE-->>FE: Set-Cookie: token=<JWT> + JSON response

    Note over FE,BE: On subsequent protected requests...

    FE->>BE: POST /api/food/addItem (with cookie)
    BE->>MW: authFoodPartnerMiddleware runs first
    MW->>MW: jwt.verify(cookie.token, JWT_SECRET)
    MW->>DB: foodpartnerModel.findById(data.id)
    DB-->>MW: FoodPartner document → req.foodpartner
    MW-->>BE: next() — request proceeds to controller
    BE-->>FE: 201 Created — food item saved
```

---

### Video Upload Flow (Food Partner → ImageKit → MongoDB)

```mermaid
sequenceDiagram
    participant FP as FoodPartner Dashboard
    participant BE as Express Backend
    participant Multer as Multer Middleware
    participant IK as ImageKit CDN
    participant DB as MongoDB

    FP->>BE: POST /api/food/addItem\n(multipart/form-data: video + metadata)
    BE->>Multer: multer({ memoryStorage }) buffers the file
    BE->>BE: authFoodPartnerMiddleware verifies JWT
    BE->>IK: storageServices.fileUpload(buffer, uuid())
    Note over IK: File saved as <uuid>.mp4
    IK-->>BE: { url: "https://ik.imagekit.io/..." }
    BE->>DB: foodModel.create({ foodname, video: url, foodpartner._id, tags[] })
    DB-->>BE: Saved food document
    BE-->>FP: 201 { message, food }
```

---

### Like / Save Flow (User ↔ Food Reel)

```mermaid
sequenceDiagram
    participant U as UserHome (React)
    participant BE as Express Backend
    participant LM as likes.models / save.models
    participant FM as food.models

    U->>BE: POST /api/food/like { foodId } (user cookie)
    BE->>LM: likeModel.findOne({ user, food: foodId })
    alt Already liked
        BE->>LM: likeModel.deleteOne(...)
        BE->>FM: foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } })
        BE-->>U: 200 "Food unliked successfully"
    else Not yet liked
        BE->>LM: likeModel.create({ user, food: foodId })
        BE->>FM: foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: +1 } })
        BE-->>U: 200 "Food liked successfully"
    end

    Note over U,BE: Same toggle pattern for POST /api/food/save
```

---

### Frontend Routing Map

```mermaid
graph TD
    Root["/ — LandingPage\n🏠 Browse all restaurants"]
    UHome["/user/Home — UserHome\n🎥 Reel feed + Like/Save + Bottom Nav"]
    ULogin["/user/login — UserLogin"]
    UReg["/user/register — UserRegister"]
    UProfile["/user/profile — UserProfile"]
    RestProfile["/restaurant/:id — RestaurantProfile\n🏪 Public profile — reels gated by login"]
    FPLogin["/foodpartner/login — FoodPartnerLogin"]
    FPReg["/foodpartner/register — FoodPartnerRegister"]
    FPProfile["/foodpartner/profile — Profile\n👤 Avatar management + reels grid"]
    FPHome["/foodpartner/Home — FoodPartnerHome\n📊 Upload reels + background image"]

    Root -->|click restaurant card| RestProfile
    Root --> ULogin
    Root --> FPLogin
    ULogin --> UHome
    UReg --> UHome
    UHome -->|Visit Store button| RestProfile
    RestProfile -->|not logged in| ULogin
    FPLogin --> FPProfile
    FPReg --> FPProfile
    FPProfile -->|dashboard button| FPHome
    FPHome -->|My Profile button| FPProfile
```

All routes are defined in `AppRoutes.jsx` and rendered through `App.jsx → AppRoutes`.

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Body / Params | Auth Required | What It Does |
|---|---|---|---|---|
| `POST` | `/user/register` | `{ fullname, email, password }` | ❌ | Creates user, hashes password, sets JWT cookie |
| `POST` | `/user/login` | `{ email, password }` | ❌ | Verifies credentials, sets JWT cookie |
| `GET` | `/user/logout` | — | ❌ | Clears JWT cookie |
| `GET` | `/user/me` | — | ✅ User Cookie | Returns logged-in user info (used for auth checks on public pages) |
| `POST` | `/foodpartner/register` | `{ fullname, contactName, phone, address, email, password }` | ❌ | Creates restaurant partner, sets JWT cookie |
| `POST` | `/foodpartner/login` | `{ email, password }` | ❌ | Verifies partner, sets JWT cookie |
| `GET` | `/foodpartner/logout` | — | ❌ | Clears JWT cookie |
| `POST` | `/foodpartner/image` | `FormData: image (file)` | ✅ FP Cookie | Uploads image to ImageKit, saves CDN URL to DB |
| `GET` | `/foodpartners` | — | ❌ | Returns all restaurant partners (for landing page) |

### Food / Reels Routes — `/api/food`

| Method | Endpoint | Body / Params | Auth Required | What It Does |
|---|---|---|---|---|
| `POST` | `/addItem` | `FormData: video, foodname, description, tags` | ✅ FP Cookie | Uploads video to ImageKit, saves food item to DB |
| `GET` | `/getItem` | — | ✅ User Cookie | Returns all food reels (for user reel feed) |
| `GET` | `/getFoodpartnerItems` | — | ✅ FP Cookie | Returns only the logged-in partner's uploaded reels |
| `GET` | `/restaurant/:id` | `:id = foodpartner ObjectId` | ❌ Public | Returns the food partner's details + all their videos (used by RestaurantProfile page) |
| `POST` | `/like` | `{ foodId }` | ✅ User Cookie | Toggles like/unlike on a food reel; increments/decrements `likeCount` on the food document |
| `POST` | `/save` | `{ foodId }` | ✅ User Cookie | Toggles save/unsave on a food reel (bookmark) |
| `GET` | `/saved` | — | ✅ User Cookie | Returns all food reels bookmarked by the logged-in user (populated from save documents) |

---

## 🗄️ Database Schema Design

### `users` Collection
```js
{
  fullname : String  (required),
  email    : String  (required, unique),
  password : String  (required — bcrypt hashed, never stored in plain text)
}
```

### `foodpartners` Collection
```js
{
  fullname    : String  (required — restaurant name),
  contactName : String  (required — owner/contact person),
  phone       : String  (required),
  address     : String  (required),
  email       : String  (required, unique),
  password    : String  (required — bcrypt hashed),
  image       : String  (default: "" — ImageKit CDN URL for profile/background image)
}
```

### `foodmodels` Collection
```js
{
  foodname    : String   (required),
  video       : String   (required — ImageKit CDN URL for the reel video),
  description : String,
  tags        : [String] (default: [] — comma-separated, parsed on upload),
  likeCount   : Number   (default: 0 — incremented/decremented by the like toggle API),
  foodpartner : ObjectId (ref → "foodpartner" — links reel to its restaurant)
}
```

> The `foodpartner` field on each food item is a **Mongoose reference** (`ref: "foodpartner"`), enabling population queries to join reel data with restaurant data in a single query.

### `likes` Collection
```js
{
  user      : ObjectId  (ref → "user", required),
  food      : ObjectId  (ref → "foodModel", required),
  createdAt : Date      (auto — from timestamps: true)
}
```

> Each document represents one user liking one food reel. The API checks for an existing document to decide whether to like or unlike (toggle behavior). `likeCount` on the food document is kept in sync.

### `saves` Collection
```js
{
  user      : ObjectId  (ref → "user", required),
  food      : ObjectId  (ref → "foodModel", required),
  createdAt : Date      (auto — from timestamps: true)
}
```

> Same toggle pattern as likes. `GET /api/food/saved` populates the `food` field to return full food documents sorted by newest bookmark first.

---

## 🔐 Security Design

### Why HttpOnly Cookies?

Most tutorials store JWT tokens in `localStorage`. This project uses **HttpOnly cookies** instead — here's why:

| Storage Method | XSS Vulnerable? | CSRF Vulnerable? | Used Here? |
|---|---|---|---|
| `localStorage` | ✅ Yes — any JS on page can read it | ❌ No | ❌ |
| HttpOnly Cookie | ❌ No — JS cannot access it | ✅ Yes (mitigated by CORS + credentials policy) | ✅ |

- On login, the server calls `res.cookie("token", jwt, { httpOnly: true, maxAge: 7d })` — the browser stores and auto-expires it
- On every request from React, Axios sends `withCredentials: true` — cookie is attached automatically
- Express reads it via `req.cookies.token` (enabled by `cookie-parser`)
- Middleware verifies and decodes the JWT, then attaches the full user/partner document to `req`

### JWT Expiry + Cookie Matching

Tokens are signed with `expiresIn: '7d'` and cookies are set with `maxAge: 7 * 24 * 60 * 60 * 1000` (7 days in ms). Both expire together so the browser never sends a dead token on future requests.

### Token Expiry Handling in Middleware

Instead of a generic `"Invalid token"` error, the auth middleware distinguishes between two failure types:

```js
catch (err) {
    if (err.name === "TokenExpiredError") {
        res.clearCookie("token");  // wipe the stale cookie from the browser
        return res.status(401).json({ message: "Session expired. Please login again." });
    }
    return res.status(401).json({ message: "Invalid session. Please login again." });
}
```

This ensures a clean UX: expired sessions prompt a re-login rather than a cryptic error, and the browser doesn't keep sending dead cookies.

### Input Validation with Zod

Every POST endpoint is protected by a `validate(schema)` middleware that runs **before** the controller:

```
Request body → validate(schema) → FAIL: 400 + field-level errors (controller never runs)
                                → PASS: sanitized data passed to controller
```

6 Zod schemas cover all POST routes — emails are lowercased, strings trimmed, ObjectIds verified to be 24 chars, passwords checked for minimum length. Malformed data never reaches MongoDB.

### Dual-Role Auth

Both Users and Food Partners use the same `token` cookie name but go through **separate middleware functions** (`authUserMiddleware` and `authFoodPartnerMiddleware`). Each middleware looks up the decoded ID in its respective MongoDB collection, so a user token cannot impersonate a food partner and vice versa. A null check is also present — if the account was deleted after the token was issued, the request is rejected.

### Environment-Based CORS

CORS is configured via `process.env.FRONTEND_URL` — not hardcoded to any domain. This means the same backend works in both local development (`http://localhost:5173`) and production (`https://your-app.vercel.app`) with zero code changes.

### Centralized Axios Instance

All frontend API calls go through `src/api/axiosInstance.js` — a single Axios instance pre-configured with:
- `baseURL` from `VITE_API_URL` environment variable
- `withCredentials: true` (so cookies are sent automatically on every request)

---

## 🌐 Deployment

This project is configured for deployment on **Vercel** (frontend) + **Render** (backend) + **MongoDB Atlas** (database).

### Backend — Render

1. New Web Service → connect GitHub repo
2. Set **Root Directory** to `backend`, **Start Command** to `node server.js`
3. Add environment variables in the Render dashboard:

```env
MONGODB_CONNECTION   = mongodb+srv://user:pass@cluster.mongodb.net/zomoreels
JWT_SECRET           = your_secret_key
IMAGEKIT_PUBLIC_KEY  = ...
IMAGEKIT_PRIVATE_KEY = ...
IMAGEKIT_URL_ENDPOINT = https://ik.imagekit.io/your_id
FRONTEND_URL         = https://your-app.vercel.app
```
> ⚠️ Do **not** add `PORT` — Render injects it automatically.

### Frontend — Vercel

1. New Project → connect GitHub repo
2. Set **Root Directory** to `frontend`, Framework Preset: **Vite**
3. Add environment variable:

```env
VITE_API_URL = https://your-backend.onrender.com
```

The `vercel.json` at `frontend/vercel.json` handles SPA routing — refreshing on any sub-route (e.g. `/restaurant/:id`) returns the React app instead of a 404.

### Cross-Domain Cookie Note

When frontend and backend are on different domains (Vercel ↔ Render), cookies require:
```js
res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",  // allows cross-domain cookies
    secure: true,      // required with sameSite: 'none' (HTTPS only)
});
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI
- An [ImageKit](https://imagekit.io) account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/gauravs2430/Reel-STyle-Video-Feed-Integration-of-Zomato-like-app.git
cd Reel-STyle-Video-Feed-Integration-of-Zomato-like-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `/backend/.env`:
```env
PORT=3002
MONGODB_CONNECTION=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npx nodemon server.js
# Server listening on http://localhost:3002
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# App running on http://localhost:5173
```

Create `/frontend/.env`:
```env
VITE_API_URL=http://localhost:3002
```

> ⚠️ Make sure the backend is running before starting the frontend. The Axios instance reads `VITE_API_URL` from the env file — without it, all API calls go to `undefined`.

---

## 🗺️ Roadmap

- [x] Dual-role authentication — User & Food Partner with HttpOnly JWT cookies
- [x] Reel-style fullscreen vertical video feed for users (scroll-snap, autoplay)
- [x] Food Partner dashboard with video (reel) upload to ImageKit
- [x] Restaurant background image upload & live display on landing page
- [x] Food partner avatar upload / change / remove (popup menu on profile page)
- [x] Restaurant search/filter on landing page
- [x] Tags support on food items
- [x] Like / unlike food reels (real DB count, optimistic UI)
- [x] Save / unsave food reels (bookmarks, per-user)
- [x] Saved Reels tab in user feed (bottom navigation: Home / Saved)
- [x] Public Restaurant Profile page — auth-gated reels & order button
- [x] Landing page restaurant cards → Restaurant Profile page
- [x] Food Partner Profile page — avatar, stats, uploaded reels grid
- [x] Centralized Axios instance (no hardcoded URLs in components)
- [x] Fully responsive UI (desktop, tablet, mobile)
- [x] Dark mode via `prefers-color-scheme`
- [x] **Zod input validation** on all POST endpoints (field-level errors, type coercion)
- [x] **Try/catch error handling** on every controller function
- [x] **JWT expiry** (`expiresIn: '7d'`) + cookie `maxAge` synced to 7 days
- [x] **Token expiry handling** — middleware clears expired cookie, returns 401 with clear message
- [x] **Deleted account guard** — middleware rejects valid tokens for deleted DB users
- [x] **Environment-based CORS** (`FRONTEND_URL` env var — works for local & production)
- [x] **Deployment-ready** — Vercel (frontend) + Render (backend) + `vercel.json` for SPA routing
- [ ] Comments on food reels (Socket.io real-time)
- [ ] Location-based restaurant filtering (geolocation)
- [ ] Follow a restaurant — get notified on new reels
- [ ] Admin panel for platform management
- [ ] Payment & ordering system integration
- [ ] CI/CD pipeline with GitHub Actions

---

## 👨‍💻 Author

**Gaurav** — [@gauravs2430](https://github.com/gauravs2430)

---

## ⚠️ Development Status

> **🚧 This project is actively under development.**
>
> Core features are fully functional and the codebase has been hardened with production-grade practices: input validation (Zod), error handling (try/catch on all controllers), JWT expiry with cookie lifecycle management, environment-based CORS, and deployment configuration for Vercel + Render. The foundations are solid and built with industry-standard patterns.
>
> Feel free to explore the code, raise issues, or suggest improvements!

---
