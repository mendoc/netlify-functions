require("dotenv").config();
const cheerio = require("cheerio");
const axios = require("axios");

let botURL =
  "https://api.telegram.org/bot[BOT_TOKEN]/sendMessage?chat_id=[CHAT_ID]&parse_mode=Markdown&text=[MESSAGE]";
const quotesURL =
  "https://guidefreelance.com/citation-dentrepreneur-ou-pour-entrepreneur";

exports.handler = async function (event, context) {
  const axiosResponse = await axios.request({
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
    url: quotesURL,
  });

  // Handle HTML data to extract a quote
  const $ = cheerio.load(axiosResponse.data);
  const items = $("article ul li");
  const item = items.eq(Math.floor(Math.random() * items.length));
  const rawQuote = item.text();
  const quote = rawQuote.split(":").reverse().join("\n_").trim() + "_";

  // Send the quote to a Telegram bot
  botURL = botURL
    .replace("[BOT_TOKEN]", process.env.BOT_TOKEN)
    .replace("[CHAT_ID]", process.env.CHAT_ID)
    .replace("[MESSAGE]", encodeURI(quote));

  axios.get(botURL).catch((err) => console.error(err.message));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quote: quote, raw: rawQuote }),
  };
};
