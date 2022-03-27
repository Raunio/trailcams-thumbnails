'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
const AWS = require('aws-sdk-mock');
var context;

let mockEvent = {
    Records: [
        {
            s3: {
                bucket: {
                    name: 'bucket',
                },
                object: {
                    key: 'moose_640.jpg',

                }
            }
        }
    ]
}

AWS.mock('S3', 'getObject', { Body: Buffer.from(require('fs').readFileSync('moose_640.jpg')), Metadata: { timestamp: new Date().toDateString() }, LastModified: new Date() });
AWS.mock('S3', 'putObject', undefined);

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const result = await app.lambdaHandler(mockEvent, context)
        expect(result).to.be.an('string');
        expect(result).to.equal(mockEvent.Records[0].s3.bucket.name + '/' + mockEvent.Records[0].s3.object.key);
    });
});
