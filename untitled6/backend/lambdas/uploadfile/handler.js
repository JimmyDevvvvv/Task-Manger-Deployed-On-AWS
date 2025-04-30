const AWS = require('aws-sdk');
const { success, error } = require('../../../common/response');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const { taskId, filename } = JSON.parse(event.body);

        const bucket = process.env.S3_BUCKET_NAME;
        const key = `uploads/${userId}/${taskId}/${filename}`;

        const params = {
            Bucket: bucket,
            Key: key,
            Expires: 60 * 5, // URL valid for 5 minutes
            ContentType: 'application/octet-stream'
        };

        const uploadURL = await s3.getSignedUrlPromise('putObject', params);

        return success({ uploadURL, key });
    } catch (err) {
        console.error(err);
        return error('Failed to generate upload URL');
    }
};
