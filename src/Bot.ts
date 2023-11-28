import TelegramBot from 'node-telegram-bot-api';
import schedule from 'node-schedule';
import { logWithTime } from './utils';
import commands from './constants/commands';
import handleTextMessage from './handlers/handleTextMessage';
import checkShop from './jobs/checkShop';

const BOT_TOKEN = process.env.BOT_TOKEN ?? '';

if (!BOT_TOKEN) {
  logWithTime('⛔️ BOT_TOKEN must be set');
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

let botInfo: TelegramBot.User;
let botName: string;

export const start = async () => {
  bot.setMyCommands(commands);

  bot
    .getMe()
    .then((user) => {
      botInfo = user;
      botName = botInfo?.username ?? '';
      if (!botName) {
        logWithTime('⛔️ Bot username not found');
      } else {
        logWithTime('🤖 Bot', `@${botName}`, 'has started...');
      }
    })
    .catch((e) => console.log(e));

  bot.on('text', (msg) => {
    handleTextMessage(bot, botInfo, msg);
  });

  schedule.scheduleJob('*/1 * * * *', () => checkShop(bot));
  checkShop(bot);
};

export default bot;
