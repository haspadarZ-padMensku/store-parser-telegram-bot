import TelegramBot from 'node-telegram-bot-api';
import { isGroup } from '../utils';
import handlePrivateCommands from './handlePrivateCommands';

const handleTextMessage = async (bot: TelegramBot, botInfo: TelegramBot.User, msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;

  if (!msg.text) {
    return;
  }

  // Group mode
  // Only respond to messages that start with @botName in a group chat
  if (isGroup(msg.chat.type)) {
    console.log('group mode');
  }

  // Private mode
  // Handle commands
  const isCommand = await handlePrivateCommands(bot, botInfo, msg);
  if (isCommand) {
    return;
  }

  // if no commands in Private mode =>
  await bot.sendMessage(chatId, '🚫 Unknown command.');
};

export default handleTextMessage;
