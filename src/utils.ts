import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';

export const logWithTime = (...args: (string | number | object | undefined | unknown)[]) => {
  console.log(new Date().toLocaleString(), ...args);
};

export const isGroup = (type: TelegramBot.ChatType) => {
  return type === 'group' || type === 'supergroup';
};

export const saveFile = async (data: string, fileName: string) => {
  try {
    await fs.promises.writeFile(fileName, data);
  } catch (error) {
    console.log(`Error during creating temp file ${fileName}`, error);
  }
};

export const getFile = async (filePath: string) => {
  try {
    const contents = await fs.promises.readFile(filePath, { encoding: 'utf8' });

    return contents;
  } catch (error) {
    console.log(`Error during reading temp file ${filePath}`, error);

    return '';
  }
};
