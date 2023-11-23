import TelegramBot from 'node-telegram-bot-api';
import * as MobistockService from '../services/mobistock';
import { getFile, logWithTime } from '../utils';

const checkShop = async (bot: TelegramBot) => {
  const newProducts = await MobistockService.getNewProducts();
  const subscriptionsData = await getFile('subscriptions.txt');

  if (subscriptionsData) {
    const subscriptions: string[] = JSON.parse(subscriptionsData);

    for await (const chatId of subscriptions) {
      for await (const product of newProducts) {
        const caption = `${product.name} \n\n${product.description} \n\n${product.price}`;

        bot.sendPhoto(chatId, product.imageUrl, {
          caption,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Buy',
                  url: product.url,
                },
              ],
            ],
          },
          parse_mode: 'Markdown',
        });
      }
    }
  }

  logWithTime('Updates were checked!');
};

export default checkShop;
