// replace the value below with the Telegram token you receive from @BotFather
const token = "6034648637:AAF3KUN6NQsTVSd5W_npG4sLONbRNkTJrqY";
const webAppUrl = "https://stellar-salamander-baf63d.netlify.app";
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
            [{text: 'Заполнить форму', web_app: { url: webAppUrl + '/form' }}]
          ]
        }
      }
    );
    await bot.sendMessage(chatId, 'Заходите в наш интернет магазин', {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }
  console.log(msg);
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Cпасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваш город: " + data?.city);
      await bot.sendMessage(chatId, "Ваша улица: " + data?.street);
      setTimeout(async() => {
        await bot.sendMessage(chatId, "Всю информацию вы получите в этом чате");
      }, 3000)

    } catch {
      console.log(e)
    }
  }
});
