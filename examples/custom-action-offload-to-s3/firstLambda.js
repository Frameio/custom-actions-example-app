const { s3Uploader } = require('./api');

exports.handler = async (event) => {
    let { caller, parentTraceID, url, name } = event;
    
    // Logs for conveniente searching in X-Ray and CloudWatch
    console.log(`debug: ${process.env._X_AMZN_TRACE_ID}`);
    console.log(`Called by ${caller} with trace ID: ${parentTraceID}. Begin uploading ${name}...`);

    try {
        await s3Uploader(url, name);
    } catch(err) {
        return (`error: ${err}`);
    }
    
    return (console.log(`Done uploading ${name}!`));
  };