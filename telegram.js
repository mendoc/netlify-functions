require('dotenv').config();
const axios = require('axios')

exports.handler = async (event) => {

    console.log(event)

    const bot_message = event.queryStringParameters.message || "Message manquant"
    const bot_chatID  = event.queryStringParameters.chatid || process.env.CHAT_ID

    const bot_token  = process.env.BOT_TOKEN
    const url  = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + bot_chatID + '&parse_mode=Markdown&text=' + bot_message

    const res = await axios.get(url);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res.data.ok)
    }
}
