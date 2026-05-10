Here are polished answers for all four form questions, grounded in your ZomoReels project:
 
Q1 — Largest production system you've personally worked on (scale, role, end-to-end ownership):

ZomoReels is a full-stack food discovery platform I built end-to-end — a Zomato-inspired app with a reel-style short video feed. The system serves two user roles (regular users and food partner restaurants) and is deployed on Render (backend) + Vercel (frontend) + MongoDB Atlas (database), with ImageKit as the media CDN for all food videos and images. I owned every layer: MongoDB schema design, Express REST API, JWT auth with HttpOnly cookies, Multer + ImageKit video upload pipeline, and the React 19 frontend. I also integrated a LiveKit AI voice agent (Zomi) with read-only agent API routes. Scale is early-stage, but the architecture is designed to handle multi-tenant restaurant data, concurrent video uploads, and cross-domain authenticated sessions in production.

Q2 — Production incident or hard bug you debugged and fixed:

During the LiveKit AI voice agent integration, the agent's API calls were being silently rejected. After investigating, I found three root causes: (1) The default CORS policy only allowed my React frontend origin — LiveKit's server is an external origin, so every /api/agent request was blocked. I fixed it by adding an open CORS middleware (origin: "*") scoped specifically to the /api/agent prefix, applied before the restricted policy. (2) The getRestaurants controller referenced foodpartnerModel without importing it — a ReferenceError that would crash at runtime. (3) The food schema was missing timestamps: true, so no createdAt field existed, breaking sort-by-newest queries. All three were caught through a pre-integration audit before hitting users.

Q3 — Hands-on experience with Voice AI, Telephony, or CRM integrations in production:

Yes — I integrated a LiveKit AI voice agent (named Zomi) into ZomoReels in production. It is a conversational food discovery assistant powered by LiveKit's no-code Agent Builder with HTTP Tools that call my Express backend directly. No telephony or CRM experience yet, but I understand the architecture: the LLM decides which tool to invoke, constructs query parameters from the user's speech, hits the REST API, and speaks the JSON response back.

Q4 — Describe any Voice AI / Telephony / CRM integration work (tools, role, key challenges):

I built and deployed a LiveKit-based voice agent (Zomi) on top of ZomoReels. Tools used: LiveKit Cloud Agent Builder (no-code), LiveKit HTTP Tools for REST API calls, and my own Express + MongoDB backend as the data source. My role was designing the agent-facing API layer (/api/agent/recommendations and /api/agent/restaurants) with dynamic MongoDB $regex + $or + .populate() queries, and shaping the JSON response so the LLM could speak clean, human-readable recommendations. Key challenges: configuring a scoped open-CORS policy so LiveKit's server could reach my backend without exposing the main API, and designing query parameters flexible enough that the LLM could construct meaningful database filters from freeform spoken requests.








Here's an honest, complete breakdown:

🍜 ZomoReels — What We Built, and Where It Stands
What we built (end-to-end)
ZomoReels is a full-stack, production-deployed food discovery app modelled after Zomato + Instagram Reels. Here's the complete picture:

Layer	What's Built
Frontend	React 19 + Vite on Vercel — full reel feed, auth pages,restaurant profiles, food partner dashboard
Backend	Node.js + Express on Render — REST API with JWT auth via HttpOnly cookies
Database	MongoDB Atlas — users, food partners, food reels, likes, saves
Media CDN	ImageKit — stores and streams all reel videos and restaurant images
AI Agent	LiveKit voice agent (Zomi) — talks to your API, recommends food by voice
Seeding	Auto-uploads 4 real demo videos to ImageKit + MongoDB with realistic data
🎯 What level is this project?
This is solidly an intermediate → advanced project. Not beginner, not expert-level yet. Here's why:

It goes well beyond beginner because:

Multi-role auth system — two completely separate login flows (User vs Food Partner) with JWT, HttpOnly cookies, and sameSite: none for cross-domain production deployment
File upload pipeline — Multer (multipart parsing) → ImageKit (CDN upload) → MongoDB URL storage. This is a real production media pipeline, not a tutorial
Full deployment stack — Vercel (frontend) + Render (backend) + MongoDB Atlas + ImageKit all wired together with CORS configured correctly for cross-domain cookie sessions
AI agent integration — scoped CORS policy so a LiveKit LLM server can call your API without exposing your main routes
Like/save toggle pattern — atomic operations ($inc, upsert/delete toggle) rather than just simple CRUD
Scroll-snap reel feed — IntersectionObserver-style scroll tracking for auto-play/pause, not trivial to get right
It's not yet at senior/expert level because:

No rate limiting, no input sanitization beyond basic validators
No Redis for session caching or feed pagination
No CI/CD pipeline (just manual git push → auto-deploy)
No unit/integration tests
The AI agent is no-code (LiveKit builder), not a custom Python/JS agent
📐 Scope of the Project
ZomoReels
├── Consumer-facing app (Reels feed, like, save, visit restaurant)
├── Food Partner dashboard (upload reels, manage profile)
├── AI voice assistant (food recommendations by voice)
└── Production deployment (real users can use this right now)
In resume/interview terms: This is a portfolio-tier full-stack project that demonstrates:

Real-world backend architecture (not a todo app)
Cloud deployment with actual production constraints (CORS, cookies, CDN)
A product feature (reels) that requires non-trivial frontend engineering
Integration work (LiveKit AI) which most junior devs haven't touched
Comparable to: What a junior-to-mid developer would build as their first major original project after completing a bootcamp or self-studying for 12–18 months. It would stand out strongly in any junior/internship application and hold its own at mid-level SDE interviews too.
