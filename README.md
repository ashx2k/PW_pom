# Playwright JavaScript POM Framework with Allure + GitHub Pages + Email

This project is a complete **JavaScript-only** Playwright framework using:
- Playwright Test Runner
- Page Object Model (POM)
- Allure reporting
- Multi-browser + mobile emulation (Chromium, Firefox, WebKit, Android, iOS)
- GitHub Pages upload for public Allure report
- Email notification with report URL
- 60-day report retention (local + GitHub Pages history)
- GitHub Actions CI/CD

---

## 1) Project Structure

```text
project-root/
│
├── config/
│   └── playwright.config.js
├── constants/
│   └── frameworkConstants.js
├── pages/
│   └── LoginPage.js
├── actions/
│   └── LoginActions.js
├── tests/
│   └── loginTest.spec.js
├── reports/
│   └── reportManager.js
├── utils/
│   ├── emailUtil.js
│   ├── slackUtil.js (commented)
│   └── rocketChatUtil.js (commented)
├── .github/workflows/
│   └── playwright.yml
├── README.md
└── package.json
```

---

## 2) Node Initialization (from scratch)

If starting from an empty folder:

```bash
mkdir playwright-pom-allure-framework
cd playwright-pom-allure-framework
npm init -y
```

Then copy all files from this repository structure.

---

## 3) Install Dependencies

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install --with-deps
```

---

## 4) Install and Use Allure

Allure is already configured through:
- `allure-playwright` reporter in `config/playwright.config.js`
- `allure-commandline` in `package.json`

Generate Allure HTML report:

```bash
npm run allure:generate
```

Open Allure report in browser:

```bash
npm run allure:open
```

---

## 5) Configuration (`frameworkConstants.js`)

All configurable values are centralized in:

`constants/frameworkConstants.js`

It supports environment variables and safe defaults.

### Required test values
- `BASE_URL`
- `USERNAME`
- `PASSWORD`

### GitHub report publishing values
- `GITHUB_REPORT_REPO` (example: `my-org/my-allure-pages-repo`)
- `GITHUB_USERNAME`
- `GITHUB_TOKEN`
- `RETENTION_DAYS` (default `60`)

### Email values
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`
- `EMAIL_TO`

### Optional (commented in constants/util files)
- `SLACK_WEBHOOK`
- `ROCKET_CHAT_WEBHOOK`

---

## 6) Environment File (`.env`) Example

Create `.env` in project root:

```env
BASE_URL=https://practicetestautomation.com/practice-test-login/
USERNAME=student
PASSWORD=Password123

HEADLESS=true
VIEWPORT_WIDTH=1366
VIEWPORT_HEIGHT=768
RETRIES=1
WORKERS=2
RETENTION_DAYS=60

GITHUB_REPORT_REPO=your-user/your-gh-pages-repo
GITHUB_USERNAME=your-user
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_PAGES_BRANCH=gh-pages
LOCAL_GH_REPORT_DIR=gh-allure-reports

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
EMAIL_TO=receiver1@gmail.com,receiver2@gmail.com
```

---

## 7) Gmail App Password Setup

For Gmail SMTP, you must use an **App Password** (not your normal Gmail password):

1. Enable 2-Step Verification in Google Account.
2. Go to Google Account → Security → App passwords.
3. Generate a new app password (Mail).
4. Put it in `.env` as `EMAIL_APP_PASSWORD`.

Use:
- `EMAIL_HOST=smtp.gmail.com`
- `EMAIL_PORT=587`

---

## 8) How Test Logic Works (Selenium Java logic converted)

Target URL:
- `https://practicetestautomation.com/practice-test-login/`

Credentials:
- Username: `student`
- Password: `Password123`

Validation:
- URL must be `https://practicetestautomation.com/logged-in-successfully/`
- Heading must be `Logged In Successfully`
- If login fails, capture error text from `#error`

Flow design:
- **Test** (`tests/loginTest.spec.js`)
- **Actions** (`actions/LoginActions.js`)
- **Page** (`pages/LoginPage.js`)

---

## 9) Running Tests

Run all configured projects:

```bash
npm test
```

Run headed mode:

```bash
npm run test:headed
```

---

## 10) Framework Features Included

- JavaScript-only implementation (CommonJS)
- Playwright test runner
- Chromium, Firefox, WebKit, Android, iOS projects
- Configurable headless mode
- Configurable viewport
- Screenshot on failure
- Video on failure
- Retry support
- Parallel execution (`fullyParallel` + configurable workers)
- Allure reporter integration

---

## 11) Report Manager Flow (`reports/reportManager.js`)

After execution:
1. Generate Allure report from `allure-results`.
2. Archive report locally into `allure-history-local/<timestamp>`.
3. Delete local report folders older than 60 days.
4. Clone/Pull the GitHub Pages report repository.
5. Copy latest report to `latest/`.
6. Archive in `history/<timestamp>`.
7. Delete GitHub history folders older than 60 days.
8. Commit/push updated report.
9. Build public URL (`https://<username>.github.io/<repo>/latest/`).
10. Send email with report URL.
11. Slack and Rocket.Chat stubs are included but commented.

---

## 12) GitHub Token Setup

Create a PAT token with repo permissions (for report repository push):

1. GitHub → Settings → Developer settings → Personal access tokens.
2. Create token with at least `repo` scope.
3. Add as GitHub Actions secret: `GITHUB_TOKEN`.

Also add:
- `GITHUB_REPORT_REPO`
- `GITHUB_USERNAME`

---

## 13) CI/CD Workflow (`.github/workflows/playwright.yml`)

Trigger:
- On push to `main`
- Manual trigger via `workflow_dispatch`

Steps:
1. Checkout
2. Setup Node.js
3. Install dependencies (`npm ci`)
4. Install Playwright browsers
5. Run test (`npm test`)
6. Generate Allure report
7. Upload artifacts
8. Upload report to GitHub Pages + send email (`npm run report:post`)

Secrets required in GitHub repository:
- `BASE_URL`
- `USERNAME`
- `PASSWORD`
- `GITHUB_REPORT_REPO`
- `GITHUB_USERNAME`
- `GITHUB_TOKEN`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`
- `EMAIL_TO`

---

## 14) Commands Quick Reference

```bash
# Run tests
npm test

# Run in headed mode
npm run test:headed

# Generate Allure report manually
npm run allure:generate

# Open Allure report
npm run allure:open

# Run post execution manager manually (publish + email)
npm run report:post
```

---

## 15) Troubleshooting

### A) `allure: command not found`
Use npm script instead of global binary:
```bash
npm run allure:generate
```

### B) `Error: browser executable doesn't exist`
Install browsers:
```bash
npx playwright install --with-deps
```

### C) Email not sent
Check:
- `EMAIL_USER` is correct
- `EMAIL_APP_PASSWORD` is generated from Gmail App Password (not account password)
- SMTP host/port are correct

### D) GitHub Pages upload skipped
Check these variables are set:
- `GITHUB_REPORT_REPO`
- `GITHUB_USERNAME`
- `GITHUB_TOKEN`

### E) No changes pushed to GH report repo
This happens when generated report has no new content; the script logs "No changes to commit".

### F) Login assertion failed
On failure, the framework throws a detailed error including captured text from `#error`.

---

## 16) Notes

- This framework uses **CommonJS** consistently.
- Slack and Rocket.Chat utility files are intentionally present as commented templates.
- To avoid publishing from local runs, simply keep GitHub variables empty.
