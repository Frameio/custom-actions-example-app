const { s3Uploader } = require('./modules/api');

exports.handler = async (event) => {
    let { caller, firstLambdaTraceID, url, name } = event;
    
    // Logs for convenient searching in X-Ray and CloudWatch
    console.log(`Second Lambda trace ID: ${process.env._X_AMZN_TRACE_ID}`);
    console.log(`Called by ${caller} with trace ID: ${firstLambdaTraceID}. Begin uploading ${name}...`);

    try {
        await s3Uploader(url, name);
    } catch(err) {
        return (`error: ${err}`);
    }
    
    return (console.log(`Done uploading ${name}!`));
  };