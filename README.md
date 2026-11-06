# actions-dashboard

Every GitHub Actions run across a user's or organisation's repositories, on one page: https://actions.joclegg.dev/

Sign in with GitHub, pick yourself, an organisation the app is installed on, or any user or organisation by name, and see:

- each repository's latest run of every workflow on its default branch, failures first
- the 50 most recent runs across all of them, linking to their logs
- a Grafana-style auto-refresh, off until you choose an interval, remembered in this browser

The app asks only for read-only access to Actions. Your token stays in your browser and goes only to GitHub. Without the app installed on an account, you see its public repositories only.

See [AGENTS.md](AGENTS.md) for the structure, the infrastructure and the coding rules.

## Getting started

```sh
nvm use
npm install
npm run dev
```
