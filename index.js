// replace the value below with the Telegram token you receive from @BotFather
const token = "6034648637:AAF3KUN6NQsTVSd5W_npG4sLONbRNkTJrqY";
const webAppUrl = 'https://yandex.ru'
const TelegramBot = require("node-telegram-bot-api");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", async (msg) => {
  console.log(msg, 'msg');
  const chatId = msg.chat.id;
  const text = msg.text
  if (text === '/start') {
    // send a message to the chat acknowledging receipt of their message
    await bot.sendMessage(
      chatId,
      "Привет, улыбнись и заполни форму!!!", {
        reply_markup: {
          keyboard: [
            [{text: 'Заполнить форму'}]
          ]
        }
      }
    );
    await bot.sendMessage(chatId, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }
});
