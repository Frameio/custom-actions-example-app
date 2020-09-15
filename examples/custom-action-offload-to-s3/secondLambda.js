const AWS = require('aws-sdk');
const fetch = require("node-fetch");

const s3 = new AWS.S3();

exports.handler = async (event) => {
    let { caller, traceID, url, name } = event;

    try {
      console.log(`Called by ${caller} with traceID ${traceID}. Begin uploading ${name}...`);
      let response = await fetch(url);
      let buffer = await response.buffer();
      await s3.putObject({
          Bucket: process.env.BUCKET_NAME,
          Key: name,
          Body: buffer,
        }).promise();
    }
    catch (err) {
        return (`Hit a problem: ${err.message}`);
    }      
    return (console.log(`Done uploading ${name}!`));
  };