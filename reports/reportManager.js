const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const constants = require('../constants/frameworkConstants');
const { sendEmail } = require('../utils/emailUtil');

function runCommand(command, options = {}) {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit', ...options });
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function deleteOldFolders(parentDir, retentionDays) {
  if (!fs.existsSync(parentDir)) {
    return;
  }

  const now = Date.now();
  const maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;

  fs.readdirSync(parentDir, { withFileTypes: true }).forEach((entry) => {
    const entryPath = path.join(parentDir, entry.name);
    if (!entry.isDirectory()) {
      return;
    }

    const stats = fs.statSync(entryPath);
    const age = now - stats.mtimeMs;
    if (age > maxAgeMs) {
      fs.rmSync(entryPath, { recursive: true, force: true });
      console.log(`Deleted old report folder: ${entryPath}`);
    }
  });
}

function createTimeStampFolderName() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

function buildPagesUrl() {
  if (!constants.GITHUB_REPORT_REPO || !constants.GITHUB_USERNAME) {
    return 'GitHub Pages URL unavailable (missing GITHUB_REPORT_REPO / GITHUB_USERNAME).';
  }

  const repoName = constants.GITHUB_REPORT_REPO.split('/')[1];
  return `https://${constants.GITHUB_USERNAME}.github.io/${repoName}/latest/`;
}

function updateLatestReport(cloneDir, sourceAllureReportDir) {
  const latestDir = path.join(cloneDir, 'latest');
  fs.rmSync(latestDir, { recursive: true, force: true });
  fs.cpSync(sourceAllureReportDir, latestDir, { recursive: true });
}

function copyTimestampedReport(cloneDir, sourceAllureReportDir) {
  const historyDir = path.join(cloneDir, 'history');
  ensureDir(historyDir);
  const timestampFolder = path.join(historyDir, createTimeStampFolderName());
  fs.cpSync(sourceAllureReportDir, timestampFolder, { recursive: true });
}

function configureGitIdentity() {
  runCommand('git config user.name "github-actions[bot]"');
  runCommand('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"');
}

function cloneOrPullReportRepo() {
  if (!constants.GITHUB_REPORT_REPO || !constants.GITHUB_USERNAME || !constants.GITHUB_TOKEN) {
    console.log('GitHub report repository credentials are missing. Skipping GitHub Pages upload.');
    return null;
  }

  const cloneDir = path.resolve(constants.LOCAL_GH_REPORT_DIR);
  const remoteUrl = `https://${constants.GITHUB_USERNAME}:${constants.GITHUB_TOKEN}@github.com/${constants.GITHUB_REPORT_REPO}.git`;

  if (!fs.existsSync(cloneDir)) {
    runCommand(`git clone --branch ${constants.GITHUB_PAGES_BRANCH} ${remoteUrl} ${cloneDir}`);
  } else {
    runCommand('git fetch origin', { cwd: cloneDir });
    runCommand(`git checkout ${constants.GITHUB_PAGES_BRANCH}`, { cwd: cloneDir });
    runCommand(`git pull origin ${constants.GITHUB_PAGES_BRANCH}`, { cwd: cloneDir });
  }

  return cloneDir;
}

function publishReportToGitHubPages(sourceAllureReportDir) {
  const cloneDir = cloneOrPullReportRepo();
  if (!cloneDir) {
    return null;
  }

  updateLatestReport(cloneDir, sourceAllureReportDir);
  copyTimestampedReport(cloneDir, sourceAllureReportDir);
  deleteOldFolders(path.join(cloneDir, 'history'), constants.RETENTION_DAYS);

  configureGitIdentity();
  runCommand('git add .', { cwd: cloneDir });

  try {
    runCommand('git commit -m "chore: publish latest Playwright Allure report"', { cwd: cloneDir });
  } catch {
    console.log('No changes to commit in GitHub report repository.');
    return buildPagesUrl();
  }

  runCommand(`git push origin ${constants.GITHUB_PAGES_BRANCH}`, { cwd: cloneDir });
  return buildPagesUrl();
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const allureResultsDir = path.join(projectRoot, 'allure-results');
  const allureReportDir = path.join(projectRoot, 'allure-report');

  try {
    if (fs.existsSync(allureResultsDir)) {
      runCommand('npx allure generate allure-results --clean -o allure-report', { cwd: projectRoot });
    } else {
      console.log('allure-results directory does not exist. Skipping Allure generation.');
      return;
    }

    const archiveRoot = path.join(projectRoot, 'allure-history-local');
    ensureDir(archiveRoot);
    const localArchive = path.join(archiveRoot, createTimeStampFolderName());
    fs.cpSync(allureReportDir, localArchive, { recursive: true });
    deleteOldFolders(archiveRoot, constants.RETENTION_DAYS);

    const reportUrl = publishReportToGitHubPages(allureReportDir);

    const emailText = reportUrl
      ? `Playwright execution completed.\n\nPublic Allure report: ${reportUrl}`
      : 'Playwright execution completed. Local Allure report generated, but GitHub Pages upload was skipped.';

    await sendEmail('Playwright Automation Execution Result', emailText);

    // const { sendSlackMessage } = require('../utils/slackUtil');
    // await sendSlackMessage(`Playwright run completed. Report URL: ${reportUrl || 'Not available'}`);

    // const { sendRocketChatMessage } = require('../utils/rocketChatUtil');
    // await sendRocketChatMessage(`Playwright run completed. Report URL: ${reportUrl || 'Not available'}`);
  } catch (error) {
    console.error(`Report manager failed: ${error.message}`);
  }
}

module.exports = async () => {
  await main();
};

if (require.main === module) {
  main();
}
