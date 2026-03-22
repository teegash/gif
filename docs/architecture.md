# Architecture Summary

This repository mirrors the provided implementation plan:

- React SPA frontend for dashboard, asset detail, and trade journal
- Express backend as the orchestration layer for prices, news, sentiment, and journaling
- Python FastAPI sentiment service for VADER-based scoring
- PostgreSQL schema defined in Prisma
- Redis-aware caching layer with in-memory fallback in mock mode
- Docker and CI included for local and hosted workflows

The backend is intentionally written with a mock mode so solo development can start before real infrastructure is attached. That keeps the repo usable while still matching the target production architecture from the markdown file.
