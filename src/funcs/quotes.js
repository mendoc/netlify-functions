const cheerio = require("cheerio");
const axios = require("axios");

let botURL = "https://funcs-lab.netlify.app/.netlify/functions/telegram?bot=1&chatid=-514238358";
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
  let quote = item.text();
  const rawQuote = quote;
  quote = quote.split(":").reverse().join("\n_").trim() + "_";

  // Send the quote to a Telegram bot
  botURL = encodeURI(`${botURL}&message=${encodeURI(quote)}`);
  axios
    .get(botURL, {
      method: "GET",
    })
    .catch((err) => console.error(err.message));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quote: quote, raw: rawQuote }),
  };
};
