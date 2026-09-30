# ai-tell

**Evidence-based authorship transparency and revision tool.**

ai-tell is a desktop application that audits documents for provenance signals and writing patterns (such as stylometric markers and hidden Unicode characters), helps you clean or revise them, and shows the results as a plain-language report instead of raw JSON.

> **Languages:** English 🇬🇧 · العربية 🇸🇦 — full UI translation with right-to-left (RTL) layout.

---

## Download

**[⬇️ Download ai-tell for Windows](https://github.com/MMS-21/ai-tell/releases/latest/download/ai-tell-Setup.exe)** — 112 MB

This link always serves the latest version. Run `ai-tell-Setup.exe`, and the one-click installer finishes the job: the app is installed for your user account with a desktop shortcut — no GitHub account, no extra steps.

> **Note:** the build is not code-signed yet, so Windows SmartScreen may show *"Windows protected your PC"* on first run. Click **More info → Run anyway**. Code signing is on the roadmap.

---

## About

Modern documents rarely carry a clear story of who wrote them. Text moves between authors, editors, and AI assistants, and what's left behind — metadata traces, statistical watermarks, telltale phrasing — is either invisible or unreadable to the people who need it.

**ai-tell makes that evidence visible.** It inspects a document for provenance signals and writing patterns, explains each finding in plain language, and gives you practical next steps: clean a document before sharing it, revise it toward your own voice, verify what changed, or build a style baseline you can compare against later.

### Who it's for

- **Writers and editors** who want to understand what a document reveals about its authorship
- **Researchers and reviewers** checking the provenance of submitted material
- **Anyone** who needs to clean, revise, or audit documents with evidence instead of guesswork

### How it keeps your data private

All analysis runs **locally on your machine**. The bundled backend listens only on `127.0.0.1`, and the app makes no network calls to third-party services — your documents never leave your device.

---

## Features

| Tab | What it does |
|-----|--------------|
| **Analyze** | Provenance & style audit: document statistics, sentence variety, style markers, detected writing patterns with explanations and tips, metadata (DOCX core, C2PA signatures, EXIF/XMP), and hidden Unicode characters. Optional author-baseline comparison. |
| **Clean** | Removes identifying metadata from a document and writes a cleaned copy. |
| **Revise** | Generates revision suggestions for a document, with resumable sessions. |
| **Verify** | Before/after comparison between an original and a revised document. |
| **Audit** | Bundles analysis, verification, and logs into an exportable audit package. |
| **Baseline** | Builds an author style profile from 3–5 sample documents for future comparisons. |

**Readable reports** — analysis results are rendered as an assessment banner, summary statistics, pattern explanations, and document information. The raw JSON stays available in a collapsible section.

**Supported input formats:** `.docx` `.tex` `.pdf` `.md` `.txt`

---

## Architecture

The app is a three-layer desktop architecture: an Electron shell, a React UI, and a local Python analysis engine.

```mermaid
flowchart LR
    subgraph Renderer["Renderer process — React + TypeScript + Vite"]
        UI["Tabs<br/>Analyze · Clean · Revise<br/>Verify · Audit · Baseline"]
        Report["Readable report<br/>(EN / AR + RTL)"]
    end

    Preload["preload.js<br/>contextBridge → window.api"]

    subgraph Main["Electron main process"]
        IPC["IPC handlers"]
        Proxy["HTTP proxy<br/>(5 min timeout)"]
        Proc["Backend process manager"]
    end

    Backend["FastAPI backend<br/>127.0.0.1:8765<br/>(compiled exe)"]
    Files[("Documents<br/>docx · tex · pdf · md · txt")]

    UI -->|window.api.*| Preload --> IPC --> Proxy
    Proxy -->|POST /analyze /clean /revise …| Backend
    Backend -->|JSON results| Proxy
    Proxy -.->|IPC result| Report
    Proc -->|spawns on start<br/>kills on exit| Backend
    Backend -->|reads & writes| Files
```

### What happens when you run an analysis

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Renderer (React)
    participant P as preload.js
    participant M as Electron main
    participant B as Backend :8765

    U->>UI: Pick document → Analyze
    UI->>P: window.api.analyze({filepath, baseline})
    P->>M: ipcRenderer.invoke('api:analyze')
    M->>B: POST /analyze (fetch, 127.0.0.1:8765)
    B-->>M: JSON analysis result
    M-->>UI: IPC response
    UI->>U: Readable report (patterns, metadata, tips)
```

**Security model:** the renderer runs with `contextIsolation: true` and `nodeIntegration: false`. The UI can only reach the system through the explicit `window.api` surface exposed by `preload.js`; all backend traffic is proxied over `localhost` from the main process.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Electron |
| UI | React 18, TypeScript, Vite, lucide-react |
| Backend | FastAPI + Uvicorn (distributed as a compiled PyInstaller executable) |
| Document parsing | python-docx, PyMuPDF, and related libraries (bundled in the backend) |

---

## Repository structure

```
ai-tell/
├── package.json                 # Electron app manifest (main: electron/main.js)
├── assets/                      # App icons
├── electron/
│   ├── main.js                  # Backend process manager · IPC · HTTP proxy
│   ├── preload.js               # contextBridge → window.api
│   └── renderer/
│       ├── src/                 # React UI (App.tsx, i18n, styles)
│       └── dist/                # Build output (gitignored)
└── python/
    └── dist/
        └── aitell-backend.exe   # FastAPI backend — vendored binary (see below)
```

> **About the backend:** the Python analysis engine ships only as a compiled executable; its source is not part of this repository. The binary is tracked in git as a vendored dependency so a complete app can always be built. Development mode expects a virtualenv at `python/.venv` with `python/server.py`.

---

## Getting started

### Build the UI

Requires [Node.js](https://nodejs.org/) 18+.

```bash
cd electron/renderer
npm install
npm run build      # tsc + vite → electron/renderer/dist/
```

`npm run dev` starts the Vite dev server (the app loads `http://localhost:5173` when run with `NODE_ENV=development`).

### Run the app

The packaged app is `ai-tell.exe` with resources in `resources/`:

```
resources/
├── app.asar                # packaged source (main.js, preload.js, renderer/dist)
└── python/
    └── aitell-backend.exe  # started automatically on port 8765
```

To deploy a new build into an installed app (current manual process):

```powershell
# 1. close ai-tell, then from the repo root:
Move-Item electron\renderer\node_modules ..\nm.aside
npx @electron\asar pack . ..\app.asar
Move-Item ..\nm.aside electron\renderer\node_modules

# 2. replace the installed archive and relaunch
Copy-Item ..\app.asar "<install-path>\resources\app.asar" -Force
```

Automated installer packaging is on the roadmap (see below).

---

## Version control & releases

```bash
git add -A
git commit -m "Describe what changed and why"
git push
```

- Bump `version` in the root `package.json` when you cut a release.
- Keep `main` green: run `npm run build` in `electron/renderer` before pushing UI changes.

### Planned: in-app updates

The target release flow — users press **Update** in the app header and the new version installs itself:

```mermaid
flowchart LR
    Dev["You<br/>edit → commit → tag"] --> GH["GitHub Release<br/>installer + version manifest"]
    GH -->|"check for updates"| App["App Update button<br/>download → install → restart"]
```

---

## Roadmap

- [ ] In-app **Update** button backed by GitHub Releases
- [ ] Automated Windows installer packaging (electron-builder) and release CI
- [ ] Wire the Clean/Revise option checkboxes through to the backend API calls
- [ ] LLM-assisted revision via a local Ollama server
- [ ] Persist the language choice (English / Arabic) across restarts

---

## License

Copyright © 2026 Moaaz Magdy. All rights reserved.

ai-tell is **proprietary software**. No rights to use, copy, modify, merge, publish, distribute, sublicense, or sell this software are granted, except as expressly permitted in writing by the copyright holder.

See [`LICENSE`](LICENSE) for the full terms.
