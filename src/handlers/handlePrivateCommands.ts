import TelegramBot from 'node-telegram-bot-api';
import { BotCommands } from '../types/BotCommands';
import localStorage from '../services/LocalStorage';
import { getFile, saveFile } from '../utils';

const handlePrivateCommands = async (bot: TelegramBot, botInfo: TelegramBot.User, msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;

  if (!msg.text) return;

  // const subscriptionsData = localStorage.get('subscriptions');
  const subscriptionsData = await getFile('subscriptions.txt');
  let subscriptions = [];
  let newSubscriptions = [];

  switch (msg.text) {
    case BotCommands.START:
      await bot.sendMessage(
        chatId,
        'Привет. Введи команду /subscribe и я буду проверять, появился ли новый айфон на сайте mobistock \nЧтобы остановить меня вызови команду /unsubscribe',
      );

      return true;

    case BotCommands.SUBSCRIBE:
      if (subscriptionsData) {
        const prevSubscriptions = JSON.parse(subscriptionsData);

        if (Array.isArray(prevSubscriptions)) {
          subscriptions = prevSubscriptions;
        }
      }

      newSubscriptions = [...subscriptions, chatId];
      // localStorage.set('subscriptions', JSON.stringify(newSubscriptions));
      await saveFile(JSON.stringify(newSubscriptions), 'subscriptions.txt');
      await bot.sendMessage(
        chatId,
        'Все прошло успешно. Теперь я буду присылать тебе сообщения о том, появился ли новый товар на сайте mobistock',
      );

      return true;

    case BotCommands.UNSUBSCRIBE:
      if (subscriptionsData) {
        const prevSubscriptions = JSON.parse(subscriptionsData);

        if (Array.isArray(prevSubscriptions)) {
          subscriptions = prevSubscriptions;
        }
      }

      newSubscriptions = subscriptions.filter((item) => item !== chatId);
      // localStorage.set('subscriptions', JSON.stringify(newSubscriptions));
      await saveFile(JSON.stringify(newSubscriptions), 'subscriptions.txt');
      await bot.sendMessage(
        chatId,
        'Все прошло успешно. Я больше не буду присылать тебе сообщения о том, появился ли новый товар на сайте mobistock',
      );

      return true;

    default:
      break;
  }

  return false;
};

export default handlePrivateCommands;
