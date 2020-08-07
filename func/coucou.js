exports.handler = async (event, context) => {
    console.log(process.env);
    return {
        statusCode: 200,
        body: "<h1>Tout se passe bien!</h1>"
    }
}