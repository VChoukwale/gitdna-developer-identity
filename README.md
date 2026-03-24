# 🧬 GitDNA — Your Developer Identity, Decoded

GitDNA analyzes any public GitHub profile and generates a beautiful, shareable Developer DNA Card — complete with a personality archetype, crown jewel project, language breakdown, and key stats.

> Think Spotify Wrapped, but for developers.

🔗 **Live Demo:** [git-dna.lovable.app](https://git-dna.lovable.app)

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
- **Card Export:** html2canvas
- **Animation:** Framer Motion + Canvas-based constellation particle network
- **Build Tool:** Vite

---

## Features

- **Archetype Scoring Engine** — multi-factor scoring system evaluates language diversity, repo quality, contribution patterns, and documentation habits simultaneously across all 9 archetypes
- **Crown Jewel Detection** — custom formula weighing stars, forks, recency, description quality, and topics to surface each developer's best project
- **Dynamic Card Theming** — each archetype has its own accent color that tints the avatar ring, card glow, archetype banner, and stat highlights
- **Language Visualization** — horizontal segmented bar using GitHub's official language colors
- **Downloadable PNG Cards** — high-resolution card export with base64 avatar embedding to solve CORS issues
- **Interactive Constellation Background** — animated particle network with mouse-reactive behavior and parallax depth
- **Animated Logo** — Git-branch-to-DNA-helix animation with flowing strands and pulsing commit dots
- **Responsive Design** — works on desktop and mobile
- **No Login Required** — uses only GitHub's public API endpoints

---

## Screenshots
<img width="560" height="851" alt="GitDNA Landing Page" src="https://github.com/user-attachments/assets/dd8fdcfc-45c2-47e3-af66-29102ffeab21" />
<img width="588" height="894" alt="The Open Source Champion" src="https://github.com/user-attachments/assets/a032d414-a0f0-4e88-afd7-1774876e7b71" />
<img width="574" height="866" alt="The Full Stack Alchemist" src="https://github.com/user-attachments/assets/67ac4485-9460-4d93-a265-784c4b3ad02d" />
<img width="582" height="870" alt="The Polyglot Wanderer" src="https://github.com/user-attachments/assets/c7054884-b0b6-4be3-8f1e-7a46c7079523" />
<img width="525" height="893" alt="The Architect" src="https://github.com/user-attachments/assets/e208c11e-7021-4ad0-aa6e-192f5ace1035" />
<img width="584" height="876" alt="The Deep Specialist" src="https://github.com/user-attachments/assets/47b7ef0c-3682-49f2-951d-9a32bef2ad17" />
<img width="1160" height="1980" alt="gitdna-kadbond007" src="https://github.com/user-attachments/assets/24b34bf9-0cc8-498b-8b7d-50cf5f6c4f49" />
<img width="561" height="853" alt="The Curious Builder" src="https://github.com/user-attachments/assets/9fa7f487-fe1b-4c5d-b6a2-6e1642287ce4" />


---


## Run Locally

```bash
# Clone the repo
git clone repository
cd gitdna-developer-identity

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:8080` in your browser.

---

## Author

**Vaishnavi Choukwale**
- GitHub: [@VChoukwale](https://github.com/VChoukwale)
- LinkedIn: [Vaishnavi Choukwale](https://www.linkedin.com/in/vaishnavi-choukwale/)
- Email: vaishnavichoukwale1912@gmail.com

---

## License

MIT License — feel free to fork, modify, and build on this project.
