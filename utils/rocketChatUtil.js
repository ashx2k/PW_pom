/*
const constants = require('../constants/frameworkConstants');

async function sendRocketChatMessage(message) {
  if (!constants.ROCKET_CHAT_WEBHOOK) {
    console.log('ROCKET_CHAT_WEBHOOK is not configured. Skipping Rocket.Chat notification.');
    return;
  }

  await fetch(constants.ROCKET_CHAT_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message })
  });
}

module.exports = { sendRocketChatMessage };
*/
