Standalone Matcher (separate from API)

Purpose: run matching + notifications independently of the API, so you can place it on a separate host. It reads MongoDB directly, uses the server's matchingService, and schedules runs every X minutes.

Setup
1) Initialize env from server/.env:
   cd matcher
   npm run init:env
   # This writes matcher/.env with MONGODB_URI and defaults

2) Start scheduler (continuous):
   npm start
   # Plans runs every MATCH_INTERVAL_MINUTES (default 5)

3) One-off run (optional):
   npm run run:once
   # or set sources env in matcher/.env: MATCH_SOURCES=pararius,kamernet

matcher/.env keys
- MONGODB_URI=… (required)
- MATCH_INTERVAL_MINUTES=5
- MATCH_LOOKBACK_MINUTES=180
- MATCH_LIMIT=200
- MATCH_SOURCES=  (optional comma-separated list)

Notes
- This process uses server/models and server/services for matching; it does not run Express.
- On the API host, you may disable the built-in frequent matching if you want all matching here.
