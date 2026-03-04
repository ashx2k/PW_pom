/*
const constants = require('../constants/frameworkConstants');

async function sendSlackMessage(message) {
  if (!constants.SLACK_WEBHOOK) {
    console.log('SLACK_WEBHOOK is not configured. Skipping Slack notification.');
    return;
  }

  await fetch(constants.SLACK_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message })
  });
}

module.exports = { sendSlackMessage };
*/
