import TelegramBot from 'node-telegram-bot-api';
import { BotCommands } from '../types/BotCommands';

const commands: TelegramBot.BotCommand[] = [
  { command: BotCommands.START, description: 'start Bot' },
  { command: BotCommands.SUBSCRIBE, description: 'subscribe on product updates' },
  { command: BotCommands.UNSUBSCRIBE, description: 'unsubscribe from product updates' },
];

export default commands;
