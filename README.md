# Boot Room Trivia

A playable prototype for a poker-room style football trivia game. Players register a table name, choose a 2-4 seat room, pick a table personality, and play mixed-format football questions against other humans or table opponents.

Live prototype: https://boot-room-trivia-prototype.calmriver15.chatgpt.site

## What Is Included

- Single-page playable prototype
- 2, 3, or 4 seat room setup
- Human registration flow with admin mode for `Calmriver15`
- Bot-filled empty seats with personality styles
- 5, 10, or 15 question rounds
- Mixed question formats:
  - direct answer
  - multiple choice
  - fill in the blank
  - sequence ordering
  - matching pairs
- Football question bank covering:
  - Premier League
  - La Liga
  - Serie A
  - Bundesliga
- Weekly and country leaderboard UI
- 25-second turn clock
- Clue activation flow
- Visible bot answer selections before turn resolution

## Current Game Rules

- Every player starts at `0`.
- Each question is one round.
- Each player gets one opportunity to answer per question.
- A correct answer is worth `+10`.
- A player may activate one clue per question.
- If a player answers correctly after activating a clue, the answer is worth `+5`.
- Passing has no point deduction.
- If every player passes or misses, the question is voided and the room moves to the next question.
- Highest score at the end of the selected question deck wins.

## Prototype Notes

This is an early QA prototype. The leaderboard data is currently simulated and reset for testing. Bot players are intentionally shown as character-plus-number table names, with no explicit bot label in the leaderboard.

## Project Structure

```text
.
├── index.html                         # Main playable prototype
├── outputs/boot-room-trivia/index.html # User-facing output copy
├── scripts/build-site.mjs             # Builds the deployable Sites bundle
├── dist/                              # Generated deployment bundle
├── package.json
└── README.md
```

## Run Locally

Because this is a static prototype, you can open `index.html` directly in a browser.

For a local preview server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Build

The build script copies the static page into the deployable bundle and generates a lightweight server entry point.

```bash
npm run build
```

## Roadmap

- Real multiplayer rooms
- Persistent user accounts
- Persistent weekly leaderboard reset every Sunday at 00:00 EST
- Country ranking from user profiles or region settings
- Larger curated question database
- Admin content tools for question and clue management
- Backend APIs for rooms, scoring, matchmaking, and leaderboards
- Anti-abuse guardrails for repeated names, answer automation, and duplicate sessions

## License

License not selected yet.
