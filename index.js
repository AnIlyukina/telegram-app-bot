// replace the value below with the Telegram token you receive from @BotFather
const token = "6034648637:AAF3KUN6NQsTVSd5W_npG4sLONbRNkTJrqY";
const webAppUrl = "https://stellar-salamander-baf63d.netlify.app";
//const webAppUrl = "https://dcce-31-47-167-86.eu.ngrok.io";
const TelegramBot = require("node-telegram-bot-api");
const express = require('express')
const cors = require('cors');


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const app = express()
app.use(express.json())
app.use(cors())

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
  console.log(msg)
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
      "Привет, ты секси!!!", {
        reply_markup: {
          keyboard: [
            [{text: 'Оставь отзыв', web_app: { url: webAppUrl + '/comment' }}]
          ]
        }
      }
    );
    await bot.sendMessage(chatId, 'Утали жажду!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }
  // console.log(msg);
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Cпасибо за ваш отзыв!");
    } catch {
      console.log(e)
    }
  }
});
app.post('/web-data', async (req, res) => {
  const { queryId, userInfo, price, order } = req.body;
  // console.log(userInfo, price, order);
  try {
      await bot.answerWebAppQuery(queryId, {
        type: "article",
        id: queryId,
        title: "Успешная покупка",
        input_message_content: {
          message_text:
            "Поздравляем с покупкой с вами скоро свяжутся. Cумма: " + price + "p.",
        },
      });
      // return res.status(200)
  } catch (e) {
      await bot.answerWebAppQuery(queryId, {
        type: "article",
        id: queryId,
        title: "Не удалось приобрести товар",
        input_message_content: {
          message_text:
            "Не удалось приобрести товар",
        },
      });
      // return res.status(500);
    }
})

const PORT = 8000
app.listen(PORT, () => console.log('server started on PORT ' + PORT))
