exports.handler = async (event, context) => {
    console.log(event);
    return {
        statusCode: 200,
        body: "<h1>Tout se passe bien!</h1>"
    }
}