# trailcams-thumbnails

This project contains the source code for AWS Lambda Function trailcams-thumbnails. The purpose of the function is to be triggered on S3 put event action to create thumbnails from uploaded images.

## Prerequisites

AWS SAM CLI needs to be installed. Official instructions can be found here: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html

## Build

```bash
$ sam build
```

## Test

```bash
$ cd create-thumbnail
$ npm run test
```
