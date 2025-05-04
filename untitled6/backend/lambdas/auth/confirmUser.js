const AWS = require("aws-sdk");
const mysql = require("mysql2/promise");
const { success, error } = require("../../common/response");
const { getSecretHash } = require("../../utils/secretHash");
require("dotenv").config();

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: process.env.AWS_REGION,
});

exports.handler = async (event) => {
    try {
        const { email, code } = JSON.parse(event.body || "{}");

        const secretHash = getSecretHash(
            email,
            process.env.COGNITO_CLIENT_ID,
            process.env.COGNITO_CLIENT_SECRET
        );

        // Step 1: Confirm user in Cognito
        await cognito.confirmSignUp({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
            SecretHash: secretHash
        }).promise();

        console.log("✅ Cognito user confirmed");

        // Step 2: Get user attributes (especially the Cognito Sub)
        const userData = await cognito.adminGetUser({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: email,
        }).promise();

        const subAttr = userData.UserAttributes.find(attr => attr.Name === "sub");
        const sub = subAttr?.Value;

        if (!sub) return error("Could not retrieve Cognito sub", 500);

        console.log("🧠 Cognito Sub:", sub);

        // Step 3: Insert into RDS users table
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        await conn.execute(
            "INSERT INTO users (user_id, username, email) VALUES (?, ?, ?)",
            [sub, email.split('@')[0], email]
        );

        return success({ message: "✅ User confirmed and saved to RDS!" });

    } catch (err) {
        console.error("💥 Error:", err.message);
        return error(err.message || "Confirmation failed", 400);
    }
};
