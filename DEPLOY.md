# Deploying Excuse Generator to GitHub Pages

Everything is automated via GitHub Actions. Follow these steps once and every future push to `main` will redeploy automatically.

---

## 1 — Export your project from Figma Make

In Figma Make, click **Export** (or **Download**) to get a ZIP of the project source code, then unzip it locally.

---

## 2 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new).
2. Give it any name (e.g. `excuse-generator`). Keep it **public** (GitHub Pages is free for public repos).
3. Do **not** initialise with a README — you'll push your own files.
4. Click **Create repository**.

---

## 3 — Push the code

Open a terminal in the unzipped project folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your real values.

---

## 4 — Enable GitHub Pages (Actions source)

1. Open your repo on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Click **Save**.

That's it — no branch or folder to select.

---

## 5 — Watch the first deployment

1. Go to the **Actions** tab of your repo.
2. You'll see a workflow called **Deploy to GitHub Pages** running (triggered by the push you just made).
3. Wait ~1–2 minutes for it to finish (green checkmark ✅).

---

## 6 — Visit your live site

Your app is now live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

The URL is also shown in **Settings → Pages** and in the Actions run summary.

---

## How it works (technical summary)

| File | What it does |
|------|-------------|
| `.github/workflows/deploy.yml` | Runs on every push to `main`; installs deps, builds, and deploys to Pages |
| `vite.config.ts` | Reads `VITE_BASE_PATH` env var set by the workflow so all assets resolve correctly under `/repo-name/` |
| `package.json` | Added `dev` (local dev server) and `preview` (preview the production build locally) scripts |

### Local development

```bash
pnpm install   # first time only
pnpm dev       # starts http://localhost:5173
```

### Preview the production build locally

```bash
pnpm build
pnpm preview   # starts http://localhost:4173
```

> **Note:** When running `pnpm preview` locally the base path defaults to `/`, so all links work fine. The `/repo-name/` prefix is only applied during the GitHub Actions build.

---

## Updating the app

Just commit and push to `main`:

```bash
git add .
git commit -m "Update excuse fragments"
git push
```

GitHub Actions redeploys automatically within ~1 minute.
