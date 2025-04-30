const { success, error } = require('../../common/response');
const pool = require('../../common/db');
const AWS = require('aws-sdk');

const sqs = new AWS.SQS();

exports.handler = async (event) => {
    try {
        const { taskId, message } = JSON.parse(event.body);

        const params = {
            QueueUrl: process.env.SQS_QUEUE_URL,
            MessageBody: JSON.stringify({
                taskId,
                message,
                timestamp: new Date().toISOString()
            }),
        };

        await sqs.sendMessage(params).promise();

        return success({ message: 'Notification sent to SQS' });
    } catch (err) {
        console.error(err);
        return error('Failed to send notification');
    }
};
