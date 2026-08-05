# Boot Room Trivia

A playable prototype for football quiz rooms for the fanatics. Visitors choose a lightweight sign-in option, enter a display name, and get randomly placed into a mixed-format European football trivia room.


## First Iteration Scope

This repository currently represents the first playable product iteration. The goal is to validate the core room format, scoring rules, mixed question types, clue mechanic, table pacing, random matchmaking, and leaderboard behavior before introducing real accounts, live multiplayer, or production infrastructure.

The prototype is intentionally lightweight: the game runs in the browser from a static HTML file, and user/profile data is stored in browser storage as a backend-ready stand-in.

## What Is Included

- Single-page playable prototype
- Random 2, 3, or 4 seat room allocation
- SSO-style entry controls for visitors
- Bot-filled empty seats with rotating personality styles
- Stronger table-opponent tuning, usually playing near 8/10 difficulty with occasional lower-confidence rounds
- Auto-scaled question decks:
  - 2-seat rooms: 10 questions
  - 3-seat rooms: 15 or 20 questions
  - 4-seat rooms: 25 questions
- Rotating question formats across each room
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
- Pass and next-player table state
- Correct-answer celebration feedback

## Current Game Rules

- Every player starts at `0`.
- Each question is one round.
- Each player gets one opportunity to answer per question.
- A correct answer is worth `+10`.
- A player may activate one clue per question.
- If a player answers correctly after activating a clue, the answer is worth `+5`.
- Passing has no point deduction.
- If every player passes or misses, the question is voided and the room moves to the next question.
- If leaders are tied at the end, tied contestants enter golden-goal extra time in 3-question batches.
- Highest score after regulation or golden-goal extra time wins.



## Prototype Notes

This is an early QA prototype. 

The UI and gameplay language are designed to communicate the intended product direction: a fast, social football trivia room centered on major European leagues. It should be treated as a playable concept module, not a finished multiplayer platform.


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


