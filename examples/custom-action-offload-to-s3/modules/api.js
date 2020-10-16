const AWS = require('aws-sdk');
const fetch = require('node-fetch');

async function fetchAsset (id) {
    const token = process.env.FRAMEIO_TOKEN;
    let url = `http://api.frame.io/v2/assets/${id}?include=cover_asset`;
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
        console.log(`lxtv debug: name: ${result.name}, url: ${result.original}`);
        console.log(`${result.type}`);
        if (result.type == "version_stack") {
            console.log(`resource is a version stack. debug cover asset -  name: ${result.cover_asset.name}, url: ${result.cover_asset.original}`);
            return { url: result.cover_asset.original, name: result.cover_asset.name };
        } else {
            return { url: result.original, name: result.name };
        }
    } catch(err) {
        return (`error: ${err}`);
    }
}

function invokeLambda (caller, firstLambdaTraceID, url, name) { 

    const lambda = new AWS.Lambda();

    let req = {
        FunctionName: 'kstone-custom-action-offload-to-s3-second-lambda',
        InvocationType: 'Event', // returns statusCode 202 on success. See invoke() SDK for info
        Payload: JSON.stringify({
            caller: caller,
            firstLambdaTraceID: firstLambdaTraceID,
            url: url, 
            name: name })
    };

    return lambda.invoke(req).promise();
}

async function s3Uploader(url, name) {

    const s3 = new AWS.S3();
    
    let response = await fetch(url);
    let stream = response.body;

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: name,
        Body: stream
    };
    
    return (s3.upload(params).promise());
}

module.exports = { fetchAsset, invokeLambda, s3Uploader };