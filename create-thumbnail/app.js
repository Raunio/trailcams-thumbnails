// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
const sharp = require('sharp');

exports.lambdaHandler = async (event, context) => {
    const s3 = new AWS.S3();

    const bucket = event.Records[0].s3.bucket.name;
    const sourceKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const typeMatch = sourceKey.match(/\.([^.]*)$/);
    
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
    }

    // Check that the image type is supported
    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "png" && imageType != "jpeg") {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }

    // Get the original object
    let originalImage;

    try {
        const params = {
            Bucket: bucket,
            Key: sourceKey
        };

        originalImage = await s3.getObject(params).promise();    
    }
    catch(ex) {
        console.log(ex);
        return;
    }

    let buffer;
    try {
        buffer = await sharp(originalImage.Body).resize(200, 150).toBuffer();
    }
    catch(ex) {
        console.log(ex);
        return;
    }

    try {
        const destParams = {
            Bucket: bucket + '--thumbnails',
            Key: sourceKey,
            Body: buffer,
            ContentType: 'image',
            Metadata: {
                timestamp: originalImage.Metadata?.timestamp || originalImage.LastModified?.toISOString()
            }
        }

        const putResult = await s3.putObject(destParams).promise();
    }
    catch(ex) {
        console.log(ex);
        return;
    }

    console.log('Successfully resized ' + bucket + '/' + sourceKey + ' and uploaded to ' + bucket + '/' + sourceKey);
    return Promise.resolve(bucket + '/' + sourceKey);
};
