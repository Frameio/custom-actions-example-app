const { fetchAsset, invokeLambda } = require('./modules/api');

exports.handler = async function (event, context) {
    // Save the X-ray Trace ID and and this Lambda's function name.
    // We'll pass them to our second 'file handler' Lambda.
    const firstLambdaTraceID = process.env._X_AMZN_TRACE_ID;
    const caller = context.functionName;

    let id = JSON.parse(event.body).resource.id;
    console.log(`debug id: ${id}`);
    let { url, name } = await fetchAsset(id);
    console.log(`debug fetched data: name ${name}`);
    
    // To receive data from the Frame.io user in an Action,
    // Build two paths, a 'base case' where there is *no* data
    // Object available in the Custom Action payload, which means
    // It is the first step of the form.  Then handle the 
    // "special" case where the data object is available which means
    // the user has entered data into the Action.
    try {
        if (JSON.parse(event.body).data) {
            console.log('Path with data from the Action');
            let returnPayload = {
                statusCode: 202, 
                body: JSON.stringify({
                    'title': 'Job received',
                    'description': `Your backup job for '${name}' has been triggered.`,
                    'traceID': `${firstLambdaTraceID}`
                    })
                };
            return returnPayload;
        }
        else {
            console.log('Base case: User seeing Action for the first time.');
            await invokeLambda(caller, firstLambdaTraceID, url, name);
            let returnPayload = {
            statusCode: 202, 
            body: JSON.stringify({
                "title": "Archive your file",
                "description": "Enter your metadata below:",
                "fields": [{
                    "type": "text",
                    "name": "metadata",
                    "label": "Metadata"
                    }]
                })
            };
            return returnPayload;
            }
    } catch(err) {
        console.log(err);
        return (`Hit a problem: ${err.message}`);
    }
};