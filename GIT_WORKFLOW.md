# Git Workflow Documentation

This repository uses a lightweight, professional Git workflow designed for solo feature development with TA reviews. It follows a **three-branch strategy** and requires one Pull Request (PR) per feature with clear commit history and testing notes.

---

## Branching Strategy

**Branches**

- `main` – Production-ready, stable code only.
- `development` – Integration branch where approved features are merged.
- `feature/*` – Short‑lived branches; one per feature (created from `dev`).

**Required feature branches**

- `feature/export-import-notes`
- `feature/note-categories`
- `feature/rich-text-formatting`
- `feature/note-sharing`

**Create and push branches**

```bash
# from an up-to-date dev
git checkout development
git pull origin development

# creating feature branch
git checkout -b feature/<feature-name>

# after commits
#push to the remote origin to compare with base branch
git push -u origin feature/<feature-name>
```

---

## Commit Conventions

Use Conventional Commits - style message to keep history readable and scannable:

- `feat(scope): summary` – user-facing feature
- `fix(scope): summary` – bug fix
- `docs(scope): summary` – documentation only
- `style(scope): summary` – formatting, no logic changes
- `refactor(scope): summary` – code change that neither fixes a bug nor adds a feature
- `chore(scope): summary` – tooling, config, build, etc.

**Examples used in this project**

- `feat(export-import): add JSON export with date-stamped filename`
- `feat(export-import): import JSON with validation and dedupe`
- `feat(categories): add category selector and badge`
- `feat(richtext): save sanitized HTML and initialize editor`
- `feat(share): generate shareId and copy URL to clipboard`

---

## Standard Feature Workflow

**Step 1 – Branch**

```bash
git checkout dev
git pull origin dev
git checkout -b feature/<feature-name>
```

**Step 2 – Implement & Commit**

```bash
# work…
git add <files>
git commit -m "feat(scope): message"

```

**Step 3 – Push & Open PR**

```bash
git push -u origin feature/<feature-name>
```

Create a PR on GitHub:

- **Base**: `dev` <- **Compare**: `feature/<feature-name>`

**After merge**

```bash
git checkout dev
git pull origin dev
# clean up
git branch -d feature/<feature-name>
git push origin --delete feature/<feature-name>
```
