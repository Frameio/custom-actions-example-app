const AWS = require('aws-sdk');
const fetch = require("node-fetch");

async function fetchDataFromAPI (id) {
    const token = process.env.FRAMEIO_TOKEN;
    let url = `http://api.frame.io/v2/assets/${id}`;
    let requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    try {
        let response = await fetch(url, requestOptions);
        let result = await response.json();
        return { url: result.original, name: result.name };
    } catch(err) {
        return (`error: ${err}`);
    }
}

function invokeLambda (caller, traceID, url, name) { 

    const lambda = new AWS.Lambda();

    let req = {
        FunctionName: 'kstone-custom-action-offload-to-s3-second-lambda',
        InvocationType: 'Event', // returns statusCode 202 on success. See invoke() SDK for info
        Payload: JSON.stringify({
            caller: caller,
            traceID: traceID,
            url: url, 
            name: name })
    };

    return lambda.invoke(req).promise();
}

exports.handler = async function (event, context) {
    // Save the trace ID from our upstream API Gateway trigger,
    // We'll pass it to our second Lambda.
    const traceID = process.env._X_AMZN_TRACE_ID;

    // Get the name of the Lambda from AWS context - also pass to second Lambda
    const caller = context.functionName;

    let id = JSON.parse(event.body).resource.id;
    let { url, name} = await fetchDataFromAPI(id);
    try {
        await invokeLambda(caller, traceID, url, name);
        let returnPayload = {
            statusCode: 202, 
            body: JSON.stringify({
                'title': 'Job received',
                'description': `Your backup job for '${name}' has been triggered.`,
                'traceID': `${traceID}`
            })
        };
        return returnPayload;
    } catch(err) {
        return (`Hit a problem: ${err.message}`);
    }
};