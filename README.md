# GEPO - Github Analytics Dashboard

# Project Overview
GEPO is a web application that visualizes a user's github activity by aggregating repositories, commits and languages summary for a signed in user.
Provides a clean dashboard, charts, and summaries, plus account management (logout, delete account).


# Why this Project
1. Learn JavaScript-based frameworks: Wanted hands-on experience with Next.js, React, and modern JS/TS ecosystem.
2. Expand DevOps skills: Practice deploying to Vercel and Google Cloud Run, setting up CI/CD pipelines with GitHub Actions, and managing containerized environments.
3. Learn GraphQL: Explore GraphQL API design, resolvers, and client integration with Apollo Client/Server.

# Tech Stack
# Frontend
1. Next.js, TypeScript, Tailwind CSS
2. NextAuth.js (GitHub OAuth)
3. Apollo Client(GraphQL)
4. Axios (HTTP)

# Backend
1. Node.js, Express.js
2. MongoDB, Redis
3. Passport.js (GitHub OAuth)
4. GraphQL (Apollo Server)
5. Jest (Testing)

# DevOps
1. GCP (Cloud Run, Artifact Registry, Cloud Monitoring)
2. Vercel (frontend hosting)
3. GitHub Actions (CI/CD)
4. Docker (containerization)


# Results
1. Tests: 68/68 passing across middleware, services, routes, and GraphQL resolvers
2. Frontend: Auth flows working; settings page supports logout and delete account
3. Backend: Auth routes fixed; GraphQL schema non-null returns; API proxy routes forward cookies correctly
4. Caching: Redis-backed caching reduces repeated GitHub API calls
5. Rate limiting: Prevents abuse on login and sensitive endpoints
