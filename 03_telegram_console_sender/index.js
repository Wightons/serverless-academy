const TelegramBot = require('node-telegram-bot-api');
const commander = require('commander');
const fs = require('fs');
const path = require('path');


const token = "6732087982:AAHRk-yIe31uzjc_1zGTwbYXweubB9NzohE";
const bot = new TelegramBot(token);

const chatId = '340979978';

commander
  .version('0.1.0')
  .description('A CLI for interacting with a Telegram bot');

commander
  .command('send-message <message>')
  .description('send a message to the Telegram bot')
  .action((message) => {
    bot.sendMessage(chatId, message);
    console.log(`Message sent: ${message}`);
  });

commander
  .command('send-photo <photo>')
  .description('send a photo to the Telegram bot')
  .action((photo) => {
    const photoPath = path.join(__dirname, photo);
    if (fs.existsSync(photoPath)) {
      bot.sendPhoto(chatId, photoPath);
      console.log(`Photo sent: ${photo}`);
    } else {
      console.log(`Photo not found: ${photo}`);
    }
  });

commander.parse(process.argv);
