const { fetchAsset, invokeLambda } = require('./modules/api');

exports.handler = async function (event, context) {
    // Save the X-ray Trace ID and and this Lambda's function name.
    // We'll pass them to our second 'file handler' Lambda.
    const firstLambdaTraceID = process.env._X_AMZN_TRACE_ID;
    const caller = context.functionName;

    let id = JSON.parse(event.body).resource.id;
    let { url, name} = await fetchAsset(id);

    try {
        await invokeLambda(caller, firstLambdaTraceID, url, name);
        let returnPayload = {
            statusCode: 202, 
            body: JSON.stringify({
                'title': 'Job received',
                'description': `Your backup job for '${name}' has been triggered.`,
                'traceID': `${firstLambdaTraceID}`
            })
        };
        return returnPayload;
    } catch(err) {
        return (`Hit a problem: ${err.message}`);
    }
};