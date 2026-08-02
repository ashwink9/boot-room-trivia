# Boot Room Trivia Open Source Product Plan

## Product Rule Updates Absorbed

- A room can always be created with 2, 3, or 4 seats.
- Every visitor enters a display name through the `Let's play` funnel before reaching rooms.
- `Calmriver15` is the initial god-mode/admin identity for moderation, room controls, and future content tools.
- Public players choose seats, table personality, and question count. The local multi-human-on-one-device option is admin-only.
- At least one human must be present. Empty seats are filled by bots so a human always has opponents.
- If 2, 3, or 4 real humans join, they can play each other directly; bots only backfill remaining seats.
- Bots use character+numeric names and world-spanning portrait/avatar concepts. The app stores them as bots internally, but the table presentation does not need a loud "bot" badge.
- Scores start at `0`; the highest score at the end of the mixed-question round wins.
- Each player gets one answer opportunity per question.
- Question formats should become mixed: direct answer, multiple choice, fill in the blank, sequence ordering, and matching/map-two-tables.
- Question difficulty is scored from `3` to `10`.
- The initial football knowledge base should cover Premier League, La Liga, Serie A, and Bundesliga, with room for additional league packs later.
- Clues are active CTAs, not passive locked rows. A player may activate one clue once during their turn on a question.
- Each question owns a backend clue map: clue ID, reveal order, display text, and resulting pot value.
- Activating a clue lowers the available question pot: 10 to 5, then 5 to 3, then 3 to 1.
- Activating a clue and passing are separate actions. A player can pass without using a clue, or activate one clue and then choose whether to answer or pass.
- Bot personality ranges should feel like table archetypes: safe bettor, connection master, shark, whale, and mixed-table blends.
- Bot answer timing should range from `5` to `15` seconds, averaging close to `7` seconds.
- Leaderboards rank both humans and table opponents by weekly and all-time points.
- Credits should remain points-only for the open-source MVP unless legal review approves any paid credits or cash conversion.

## 1. Site Map

```text
/
  Home / Play Lobby
    Let's play CTA
    Display-name registration
    Room setup
    Open public rooms
    Join by code
    Rules summary
  /rooms
    Room list
    Filters: seats, humans needed, question pack, difficulty
  /rooms/new
    Create room
    Seat count
    Bot difficulty
    Table personality
    Question pack
    Round length
  /admin/rooms/new
    Admin room setup
    Local human seat count
    Table personality
    Question pack
  /rooms/:roomId
    Waiting room
    Player seats
    Bot backfill status
    Ready state
  /rooms/:roomId/play
    Live game table
    Question surface
    Clue actions
    Answer actions
    Scoreboard
    Round log
  /rooms/:roomId/results
    Final standings
    Question review
    Rematch
    Share result
  /question-packs
    Browse packs
    Pack detail
    Community pack install
  /question-packs/:packId
    Pack overview
    Categories
    Difficulty curve
    Source notes
  /create
    Question builder
    Pack editor
    Bulk import
    Validation queue
  /leaderboards
    Weekly
    All-time
    Humans and table opponents
    Pack-specific
  /profile/:username
    Public stats
    Match history
    Created packs
  /settings
    Account
    Display name
    Accessibility
    Privacy
  /admin
    God-mode dashboard
    Room moderation
    Question pack review
    User reports
  /docs
    Game rules
    Open-source contribution guide
    API docs
    Data sourcing policy
  /legal
    Terms
    Privacy
    Content and trademark policy
```

## 2. User Flows

### Journey A: Solo Human Starts a Bot-Filled Room

1. User lands on `/`.
2. User clicks `Let's play`.
3. User enters display name. `Calmriver15` receives admin/god-mode controls.
4. User chooses `2`, `3`, or `4` seats.
5. User chooses table personality, question count, and question pack.
6. System creates room and fills empty seats with named table opponents.
7. User starts game.
8. On their turn, user can answer once, activate one clue, or pass.
9. Bots respond according to personality, confidence, and clue state.
10. Results page shows standings, question review, and rematch.

### Journey B: Friends Join a Shared Room

1. Host creates room at `/rooms/new`.
2. Host shares room code/link.
3. Friends join `/rooms/:roomId`.
4. System backfills remaining seats with bots only if seats are still empty when the host starts.
5. Players ready up.
6. Game begins with rotating turns.
7. Each player has one answer attempt and one optional clue activation per question.
8. Results page offers rematch with same humans and optional bot backfill.

### Journey C: Contributor Creates a Question Pack

1. Contributor opens `/create`.
2. Contributor selects question type: direct, multiple choice, fill blank, sequence, or matching.
3. Contributor enters prompt, answer payload, clues, category, difficulty, and sources.
4. System validates required fields and answer matching.
5. Contributor previews the question as a player.
6. Contributor saves to draft pack.
7. Pack can be exported as JSON or submitted for review.
8. Maintainers approve pack into the open-source question registry.

## 3. Data Models

```ts
type PlayerKind = "human" | "bot";
type RoomStatus = "waiting" | "live" | "complete" | "abandoned";
type QuestionType = "direct" | "multiple_choice" | "fill_blank" | "sequence" | "matching";
type BotPersonality = "safe_bettor" | "connection_master" | "shark" | "whale" | "mixed";
type LeagueCode = "premier_league" | "la_liga" | "serie_a" | "bundesliga";

interface Room {
  id: string;
  code: string;
  status: RoomStatus;
  seatCount: 2 | 3 | 4;
  humanSeatCount: 1 | 2 | 3 | 4; // Public rooms default to 1; local multi-human setup is admin-only.
  questionCount: number;
  questionPackId: string;
  botPersonality: BotPersonality;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

interface Seat {
  id: string;
  roomId: string;
  position: number;
  playerId: string;
  playerKind: PlayerKind;
  isReady: boolean;
  score: number;
  attemptsThisQuestion: number;
  clueUsedThisQuestion: boolean;
  passedThisQuestion: boolean;
}

interface Player {
  id: string;
  displayName: string;
  kind: PlayerKind;
  role: "player" | "admin";
  avatarKey?: string;
  personality?: BotPersonality;
  botConfidenceCurve?: number[];
  createdAt: string;
}

interface Question {
  id: string;
  packId: string;
  league: LeagueCode;
  type: QuestionType;
  category: string;
  difficulty: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  prompt: string;
  answer: AnswerPayload;
  options?: AnswerOption[];
  clues: Clue[];
  explanation?: string;
  sources: Source[];
}

interface AnswerPayload {
  canonical: string | string[] | Record<string, string>;
  aliases?: string[];
  orderedItems?: string[];
  matchingPairs?: Array<{ left: string; right: string }>;
}

interface Clue {
  id: string;
  questionId: string;
  text: string;
  revealOrder: 1 | 2 | 3;
  potAfterReveal: 5 | 3 | 1;
  isActiveSlot?: boolean;
}

interface TurnState {
  roomId: string;
  questionId: string;
  activeSeatId: string;
  potValue: 10 | 5 | 3 | 1;
  revealedClueIds: string[];
  activeClueId?: string;
  playerClueUses: Record<string, boolean>;
  playerAnswerAttempts: Record<string, boolean>;
  playerPasses: Record<string, boolean>;
  attempts: Attempt[];
}

interface Attempt {
  id: string;
  seatId: string;
  action: "answer" | "activate_clue" | "pass" | "timeout";
  answerPayload?: unknown;
  isCorrect?: boolean;
  pointsAwarded?: number;
  createdAt: string;
}

interface LeaderboardEntry {
  id: string;
  playerId: string;
  playerKind: PlayerKind;
  scope: "weekly" | "all_time" | "pack";
  points: number;
  roomsPlayed: number;
  correctAnswers: number;
  updatedAt: string;
}
```

## 4. API Requirements

For the current static prototype, no external API is required. For a scalable version:

- `POST /api/rooms`: create room.
- `GET /api/rooms`: list joinable rooms.
- `GET /api/rooms/:id`: fetch room state.
- `POST /api/auth/guest`: register or resume a guest display name.
- `POST /api/rooms/:id/join`: join human seat.
- `POST /api/rooms/:id/backfill-bots`: fill empty seats.
- `POST /api/rooms/:id/ready`: mark player ready.
- `POST /api/rooms/:id/start`: start game.
- `GET /api/rooms/:id/state`: fetch live game state.
- `POST /api/rooms/:id/answer`: submit answer payload.
- `GET /api/questions/:id/clues`: fetch ordered clue map for a question.
- `POST /api/rooms/:id/clues/:clueId/activate`: activate the current clue slot, reveal clue text, lower pot, and enforce once-per-player rule.
- `POST /api/rooms/:id/pass`: pass turn.
- `POST /api/rooms/:id/finish`: complete room.
- `POST /api/rooms/:id/end-request`: ask for explicit end-room confirmation.
- `GET /api/admin/rooms`: god-mode room inspection.
- `POST /api/admin/rooms/:id/void-question`: admin-only question void.
- `GET /api/question-packs`: list packs.
- `GET /api/question-packs?league=premier_league|la_liga|serie_a|bundesliga`: filter packs by league.
- `POST /api/question-packs`: create pack.
- `POST /api/questions/validate`: validate authored question.
- `GET /api/leaderboards?scope=weekly|all_time|pack`: fetch leaderboard rankings for humans and table opponents.
- `POST /api/leaderboards/recalculate`: admin-only leaderboard rebuild.
- Realtime channel: `room:{roomId}` for turn changes, clue reveals, attempts, seat joins, bot actions, and results.

## 5. Component Inventory

1. App shell
2. Top navigation
3. Brand mark
4. Lobby hero
5. Let's play CTA
6. Registration form
7. Display-name input
8. Admin identity badge
9. Room setup form
10. Seat count selector
11. Admin local human player count selector
12. Bot backfill summary
13. Table personality selector
14. Bot difficulty/personality explainer
15. Question pack selector
16. Round length selector
17. Rules summary tile
18. Room list
19. Room card
20. Join room code input
21. Waiting room panel
22. Seat roster
23. Human seat card
24. Table-opponent seat card
25. Avatar portrait
26. Ready button
27. Game table layout
28. Pitch/table visual
29. Pot ladder
30. Active player indicator
31. Scoreboard
32. Question header
33. Direct-answer question component
34. Multiple-choice question component
35. Fill-blank question component
36. Sequence-order question component
37. Matching question component
38. Clue CTA button
39. Revealed clue row
40. Pass button
41. Submit answer button
42. Turn timer
43. Bot thinking state
44. Feedback toast
45. Room event log
46. End-room modal
47. Standings table
48. Question review card
49. Rematch button
50. Share result button
51. Question pack browser
52. Question builder
53. Source citation field
54. Validation error panel
55. Leaderboard table
56. Profile stats card
57. Settings form
58. Accessibility controls
59. Admin dashboard
60. Admin room inspector
61. Admin void-question control
62. Moderation report queue
63. Weekly leaderboard
64. All-time leaderboard
65. League filter tabs
66. Difficulty badge

## 6. Page Templates

- Home / Lobby: first screen has the product identity and `Let's play` CTA. The CTA opens registration: display name first, then seat count, table personality, question count, and pack selection. Below it are compact room cards, league filters, and weekly/all-time leaderboards.
- Room List: dense list of open rooms with seats, humans present, bots needed, pack, difficulty, and join CTA.
- Create Room: focused form with seat count, pack, table personality, round length, privacy, and start/join behavior. Local multi-human seat count appears only in admin room setup.
- Waiting Room: table preview with 2-4 seats, live join state, bot-fill controls, ready states, and room code.
- Live Game: two-column desktop layout. Left column is table, pot, seats, scores, and table-opponent status. Right column is question interaction, clue CTA, answer surface, pass button, and event log. Mobile stacks table first, question second.
- Results: standings first, then question-by-question review with correct answers, clues used, points won, and rematch controls.
- Question Pack Detail: pack metadata, league, categories, difficulty mix from 3-10, sample questions, sources, and install/use CTA.
- Question Builder: type selector, dynamic answer editor, clue editor, source notes, validation panel, and preview mode.
- Admin: god-mode controls for `Calmriver15`, including room inspection, void question, pack review, and future moderation.
- Docs: rules, setup guide, contribution guide, local development, data policy, and API reference.

## 7. Technical Stack Recommendation

- Current prototype: single-file HTML, CSS, and vanilla JavaScript so rules can be tested quickly without build tooling.
- Frontend: Next.js with React and TypeScript.
- Styling: CSS modules or Tailwind with a small design-token layer.
- Game state: XState or Zustand for client state; authoritative room state on server for multiplayer.
- Realtime: WebSocket layer via Socket.IO, PartyKit, or Supabase Realtime.
- Backend: Next.js API routes for MVP; extract to Fastify/NestJS later if realtime load grows.
- Database: Postgres with Prisma.
- Auth: Better Auth, Clerk, or Supabase Auth. Anonymous guest mode should exist for fast play.
- Bots: deterministic bot service first, using configurable answer confidence by personality, clue count, table archetype, and a 5-15 second response delay averaging near 7 seconds.
- Question content: versioned JSON packs in repo for open-source contribution, imported into Postgres for hosted play.
- Testing: Vitest for logic, Playwright for flows, axe-core for accessibility checks.
- Hosting: Vercel for web, Neon or Supabase for Postgres, Upstash Redis for rate limits and room presence if needed.
- License: MIT for code; separate content license for question packs and source requirements.

## 8. Performance Budgets

- First contentful paint: under 1.5s on a mid-tier mobile device.
- Largest contentful paint: under 2.5s on 4G.
- Time to interactive: under 3.0s for lobby, under 2.0s for live game route after room state is loaded.
- JavaScript shipped to lobby: under 180 KB gzip.
- JavaScript shipped to live game route: under 240 KB gzip.
- CSS: under 40 KB gzip.
- Initial API room-state response: under 60 KB.
- Realtime event payloads: under 5 KB per event.
- Image budget: avoid heavy hero images in game routes; decorative assets under 150 KB total.
- Interaction latency: answer submit and clue reveal local feedback under 100 ms; server confirmation under 300 ms target.
- Bot answer delay: 5-15 seconds, averaging near 7 seconds.

## 9. SEO Structure

Most SEO value belongs to public, indexable pages; live rooms and user-specific routes should be noindex.

- `/`
  - Title: `Boot Room Trivia - Football Trivia Rooms With Bots`
  - Description: `Create a football trivia room, play against friends or bots, reveal clues, and compete for the pot.`
- `/question-packs`
  - Title: `Football Trivia Question Packs - Boot Room Trivia`
  - Description: `Browse community football trivia packs with verified clues, mixed formats, and source notes.`
- `/question-packs/:packSlug`
  - Title: `{Pack Name} Trivia Pack - Boot Room Trivia`
  - Description: `Play {Pack Name}, a {difficulty} football trivia pack with {questionCount} questions across {categories}.`
- `/leaderboards`
  - Title: `Boot Room Trivia Leaderboards`
  - Description: `See the top football trivia humans and table opponents across weekly and all-time rooms.`
- `/docs`
  - Title: `Boot Room Trivia Docs`
  - Description: `Rules, setup guides, API docs, and contribution guidelines for the open-source football trivia game.`
- URL patterns should use lowercase kebab-case slugs.
- Add JSON-LD for `WebApplication`, `FAQPage` on docs, and `BreadcrumbList` on pack pages.
- `noindex`: `/rooms/:roomId`, `/rooms/:roomId/play`, `/settings`, `/profile/:username` unless profiles are explicitly public.
- Open Graph image: one reusable generated game-table preview plus pack-specific images later.

## Locked Decisions

1. Table opponents should use human-like character+numeric names and avatar/portrait concepts, with internal bot status preserved for fairness and moderation.
2. Scores start at `0`; no visible buy-in deduction.
3. Each player gets one answer opportunity per question.
4. Clue activation and pass are separate actions.
5. Bot behavior should use table archetypes such as safe bettor, connection master, shark, whale, and mixed table.
6. Current build path: keep iterating on a testable prototype, then convert the stable module into a repo-ready app.
7. Public users do not configure multiple humans on one device; that is an admin-only testing control.
8. Initial league coverage includes Premier League, La Liga, Serie A, and Bundesliga.
