# 🧬 GitDNA — Your Developer Identity, Decoded

GitDNA analyzes any public GitHub profile and generates a beautiful, shareable Developer DNA Card — complete with a personality archetype, crown jewel project, language breakdown, and key stats.

> Think Spotify Wrapped, but for developers.

🔗 **Live Demo:** [gitdna.app](https://gitdna.app)

---

## What It Does

Enter any GitHub username and GitDNA will:

- **Assign a Developer Archetype** — a personality type based on coding patterns (e.g., "The Deep Specialist," "The Polyglot Wanderer," "The Prolific Shipper")
- **Identify the Crown Jewel Project** — auto-picks the developer's standout repo using a custom scoring formula
- **Visualize Language DNA** — a color-coded breakdown of the developer's top programming languages
- **Surface Key Stats** — total stars, repos, followers, coding tenure, and original vs. forked ratio
- **Generate a Shareable Card** — a downloadable PNG card styled like a collectible trading card

---

## Developer Archetypes

GitDNA uses a multi-factor scoring system that evaluates every profile against all archetypes simultaneously. The highest scoring archetype wins.

| Archetype | Emoji | Signal |
|-----------|-------|--------|
| The Deep Specialist | 🎯 | 80%+ code in a single language |
| The Polyglot Wanderer | 🌍 | 6+ languages, no single language dominant |
| The Open Source Champion | 🏆 | High average stars per repo |
| The Prolific Shipper | 🚀 | 80+ public repos |
| The Architect | 🏗️ | Repos named "framework," "platform," "sdk," etc. |
| The Full Stack Alchemist | ⚗️ | Frontend + backend + infrastructure languages |
| The Documentation Perfectionist | 📚 | 70%+ repos with descriptions and topics |
| The Weekend Warrior | ⚔️ | Few repos but high quality |
| The Curious Builder | 🔮 | Default — every repo is an experiment |

---

## How It Works

GitDNA uses GitHub's free public REST API (no authentication required):

1. **Fetch Profile** — `GET /users/{username}` for name, avatar, bio, followers, account age
2. **Fetch Repos** — `GET /users/{username}/repos?per_page=100` for all public repositories
3. **Fetch Languages** — `GET /repos/{owner}/{repo}/languages` for byte-level language breakdown of top repos
4. **Score Archetypes** — a custom scoring engine evaluates the profile against all 9 archetypes simultaneously
5. **Render Card** — generates a visually rich DNA card with archetype-specific theming and accent colors
6. **Export** — html2canvas captures the card as a high-resolution PNG for sharing

---

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **API:** GitHub REST API (public, no auth)
- **Build Tool:** Lovable (AI-powered app builder)
- **Card Export:** html2canvas
- **Hosting:** Lovable / Vercel
- **Background Animation:** Canvas-based constellation particle network with mouse interaction

---

## Features

- **Archetype Scoring Engine** — multi-factor scoring system (not simple if/else) evaluates language diversity, repo quality, contribution patterns, and documentation habits
- **Crown Jewel Detection** — custom formula weighing stars, forks, recency, description quality, and topics to find each developer's best project
- **Dynamic Card Theming** — each archetype has its own accent color that tints the avatar ring, card glow, archetype banner, and stat highlights
- **Language Visualization** — horizontal segmented bar using GitHub's official language colors
- **Downloadable PNG Cards** — high-resolution card export with base64 avatar embedding to solve CORS issues
- **Interactive Constellation Background** — animated particle network with mouse-reactive behavior
- **Animated Logo** — Git-branch-to-DNA-helix animation with flowing strands and pulsing commit dots
- **Responsive Design** — works on desktop and mobile
- **No Login Required** — uses only GitHub's public API endpoints

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/VChoukwale/gitdna.git
cd gitdna

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Rate Limits

GitDNA uses GitHub's public API without authentication, which allows 60 requests per hour. Each profile decode uses approximately 3-5 API calls (profile + repos + language details for top repos). For higher limits, you can add a GitHub personal access token in the environment config.

---

## Project Background

Built in under 2 hours at **AI Side Hustle Night** hosted by AI Coalition at Klaviyo HQ, Boston (March 19, 2026). The entire app was created using Lovable's AI-powered development platform with iterative prompt engineering.

---

## Author

**Vaishnavi Choukwale**
- GitHub: [@VChoukwale](https://github.com/VChoukwale)
- LinkedIn: [Vaishnavi Choukwale](https://www.linkedin.com/in/vaishnavi-choukwale/)
- Email: choukwale.v@northeastern.edu

---

## License

MIT License — feel free to fork, modify, and build on this project.
