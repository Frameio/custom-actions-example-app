# frameio-custom-action-offload-to-s3

A Custom Actions workflow for backing up Frame.io assets to your own S3 bucket.
[Read the article]](https://medium.com/@frameiokyle/automatic-s3-backups-with-frame-io-custom-actions-and-aws-lambda-d3b8dbed0133) or watch the [webinar](https://app.frame.io/reviews/c9b1600d-d0df-4a12-8f9f-0f7b7ce7bb58) for a full walkthrough of how to deploy this code.

## Instructions for use

This repo contains sample code demonstrating a deployment of Custom Actions in the context of a serverless workflow.

The code is pre-formatted for insertion into two Lambda functions.  An HTTP endpoint should be created in AWS API Gateway and configured as the Trigger for the initial Lambda.

Once the initial Lambda runs, it will gather data from the Frame.io API and invoke a second Lambda function which completes the upload to S3 using a buffered file write.

A file `/modules/api.js` contains three helper functions to simplify the Lambda code.

The benefit of this workflow is that a Frame.io customer does not have to run a persistent server to download assets and re-upload them to a backup system.  This is accomplished automatically and cheaply with serverless technology.

## Requirements
- Frame.io developer token
- Node JS 12.x runtime
- AWS account with the ability to set IAM permissions

This function requires two environment variables:
- `FRAMEIO_TOKEN`: an API token with appropriate permissions to get assets from Frame.io
- `BUCKET_NAME`: an AWS S3 bucket where files will be uploaded.

## Components
- Frame.io Custom Action
- AWS API Gateway
- Two AWS Lambda functions
- S3 (data is streamed to S3 using the [aws-sdk](https://aws.amazon.com/sdk-for-node-js/) [S3.upload](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html) method)
- First Lambda function (`lambda.js`) receive the Custom Actions event and parses the Frame.io asset.

## Optional enhancements

As written, this lambda function simply triggers an upload of a single asset.  There are many ways it could be enhanced or optimized:

- Lambda functions are restricted to a maximum runtime of 15 minutes which limits the size of a file you can reliably upload.  To upload files larger than 2-3 GBs,  additional Lambdas could be spawned and tasked with performing one part of a distributed multi-part file upload.
- AWS Step Functions provide an alternative and arguably better soluting to fan-out Lambdas for a large upload job.

The integration to Frame.io could be expanded to cover many other workflows:
- The `fetchDataFromAPI()` function can be modified to target [proxy media files](https://support.frame.io/en/articles/13321-what-is-my-video-converted-to-when-it-s-uploaded), allowing you to incorporate Frame.io's media conversion pipeline into your backup workflow.
- Instead of using Custom Actions, you could write your own integration to our API to back up many Projects or Folders worth of files.  See the [Frame.io API Guides]](https://docs.frame.io/docs) for more details.