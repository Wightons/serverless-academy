const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 60, checkperiod: 60 });

const token = "6901694224:AAGIXkdLwd5grrIApysOlVD7itZ_re5swxA";
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Please choose a currency", {
        "reply_markup": {
            "keyboard": [["USD", "EUR"]]
        }
    });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.toString().toLowerCase();

    if (text === 'usd' || text === 'eur') {
        let rates = myCache.get("rates");
        if (rates == undefined) {
            Promise.all([
                axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'),
                axios.get('https://api.monobank.ua/bank/currency')
            ]).then(([privatRes, monoRes]) => {
                rates = {
                    usd: {
                        privat: privatRes.data.find(x => x.ccy === 'USD').sale,
                        mono: monoRes.data.find(x => x.currencyCodeA === 840).rateSell
                    },
                    eur: {
                        privat: privatRes.data.find(x => x.ccy === 'EUR').sale,
                        mono: monoRes.data.find(x => x.currencyCodeA === 978).rateSell
                    }
                };
                myCache.set("rates", rates);
                bot.sendMessage(chatId, formatMessage(text, rates));
            });
        } else {
            bot.sendMessage(chatId, formatMessage(text, rates));
        }
    }
});

function formatMessage(currency, rates) {
    return `Exchange rates for ${currency.toUpperCase()}:\n` +
           `PrivatBank: ${rates[currency].privat}\n` +
           `Monobank: ${rates[currency].mono}`;
}
