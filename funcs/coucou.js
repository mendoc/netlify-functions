const { one, e } = require('./utils');

console.log(one);

exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json"},
        body: process.env.SERVICE_ACCOUNT
    }
}