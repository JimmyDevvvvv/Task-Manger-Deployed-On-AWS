const AWS = require("aws-sdk");
const { verifyToken } = require("../../utils/verifyToken");
const { success, error } = require("../../common/response");
const crypto = require("crypto");
require("dotenv").config();

const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const dynamo = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    try {
        const authHeader = event.headers?.Authorization || event.headers?.authorization;
        if (!authHeader) return error("Unauthorized", 401);

        const token = authHeader.replace("Bearer ", "");
        const decoded = await verifyToken(token);
        const userId = decoded.sub;

        const { filename, taskId } = JSON.parse(event.body || "{}");
        if (!filename) return error("Missing filename", 400);

        const fileKey = `${userId}/${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${filename}`;
        const attachmentId = crypto.randomUUID();
        const uploadedAt = new Date().toISOString();

        const signedUrl = s3.getSignedUrl("putObject", {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
            Expires: 900,
            ContentType: "application/octet-stream",
        });

        const putItem = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: {
                attachment_id: `${attachmentId}`, // required
                user_id: `${userId}`,             // required ONLY if sort key is enabled
                task_id: taskId ? `${taskId}` : null,
                file_key: fileKey,
                uploaded_at: uploadedAt
            }
        };

        console.log("🧠 Writing to DynamoDB with:", putItem);
        await dynamo.put(putItem).promise();

        return success({ signedUrl, fileKey, attachmentId });

    } catch (err) {
        console.error("💥 Upload Error:", err);
        return error(err.message || "Failed to generate upload URL", 500);
    }
};
