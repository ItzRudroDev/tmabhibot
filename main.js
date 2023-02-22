const { Telegraf } = require("telegraf");
const axios = require("axios");
const responses = require("./responses");
const info = require("./info");

const token = "6218631437:AAFWY5MCjJXJ4ohTYEL_LVxjgmzwsHtwyR0";
const ytApiKey = "AIzaSyCIITzJYoHA7OWwXSTUVtSNDvyZes0zuZY";

const bot = new Telegraf(token);

bot.start(ctx => {
    ctx.reply("Technical Mechanism Bot is successfuly started. Use '/help' to get a list of all available commands");
});

bot.help(ctx => {
    ctx.reply(`
        /help - Helps you
/botinfo - Gives bot information
/channelinfo - Gives channel information of Technical Mechanism
/latestvid - Provides the latest video link from Technical Mechanism
/joke - Shares a joke
/news - Gives latest update news from developer itzRudro
    `);
});

// Commands
// Information
bot.command('/botinfo', ctx => {
    ctx.reply(responses[0].reply);
});

//Youtube
bot.command('/channelinfo', ctx => {
    ctx.telegram.sendChatAction(ctx.chat.id, "typing");
    axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${info.chId}&key=${ytApiKey}`).then(res => {
        ctx.reply(`
            Channel name: ${res.data.items[0].snippet.title}
Custom URL: ${res.data.items[0].snippet.customUrl}
Published at: 2022-7-18
Region: Bangladesh
Owner: Abhi
Genre: Technology
Subscribers: ${res.data.items[0].statistics.subscriberCount}
Videos: ${res.data.items[0].statistics.videoCount}
Total Views: ${res.data.items[0].statistics.viewCount}
Description: ${res.data.items[0].snippet.description}
        `);
    })
}).catch(err => {
    console.error(err);
});

bot.command('/latestvid', ctx => {
    ctx.telegram.sendChatAction(ctx.chat.id, "typing");
    axios.get(`https://www.googleapis.com/youtube/v3/search?key=${ytApiKey}&channelId=${info.chId}&part=snippet,id&order=date&maxResults=1`).then(res => {
        ctx.reply(`https://youtu.be/${res.data.items[0].id.videoId}`).catch(err => {
            console.error(err);
        });
    })
});

//Fun
bot.command('/joke', ctx => {
    axios.get("https://v2.jokeapi.dev/joke/Any?type=twopart").then(res => {
        console.log(res.data);
        ctx.telegram.sendChatAction(ctx.chat.id, "typing");
        ctx.reply(`
            ${res.data.setup}
=> ${res.data.delivery}
        `);
    }).catch(err => {
        console.error(err);
    });
});

//Updates
bot.command('/news', ctx => {
    ctx.reply("The next update will be available in 10th March, 2023. This Update will bring a lot of cool features. Till then stay tuned <3");
});

// Launching the bot
bot.launch(
    console.log("Technical Mechanism Bot is now online.")
);
