const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const WEATHER_API_KEY = "bacd94d0d075af5b2f3d5275b6913b91";
const TELEGRAM_TOKEN = "6854469396:AAHfkamdD2Y4KW5EVt0EEu0QHc9t0Uu70M4";

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});
const town = "Kyiv";

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome! Click the button below to get the weather forecast.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: `Forecast in ${town}`, callback_data: 'forecast' }]
            ]
        }
    });
});

bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;

    if (callbackQuery.data === 'forecast') {
        bot.sendMessage(chatId, 'Choose the interval for the forecast.', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Every 3 hours', callback_data: '3hours' }],
                    [{ text: 'Every 6 hours', callback_data: '6hours' }]
                ]
            }
        });
    } else {
        const interval = callbackQuery.data === '3hours' ? 3 : 6;
        getWeatherForecast(chatId, interval);
    }
});

function getWeatherForecast(chatId, interval) {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${town}&appid=${WEATHER_API_KEY}`)
        .then(response => {
            const forecasts = response.data.list.filter((_, index) => index % interval === 0);
            let message = '';
            forecasts.forEach(forecast => {
                message += `Time: ${forecast.dt_txt}, Temperature: ${(forecast.main.temp - 273.15).toFixed()} ℃\n`;
            });
            bot.sendMessage(chatId, message);
        })
        .catch(error => {
            console.log(error);
            bot.sendMessage(chatId, 'Sorry, an error occurred while fetching the weather data.');
        });
}