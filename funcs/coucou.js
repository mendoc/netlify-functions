exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: process.env.SERVICE_ACCOUNT
    }
}