const AWS = require("aws-sdk");
const { success, error } = require("../../common/response");
const { getSecretHash } = require("../../utils/secretHash");
require("dotenv").config();

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: process.env.AWS_REGION,
});

exports.handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body || "{}");

        const secretHash = getSecretHash(
            email,
            process.env.COGNITO_CLIENT_ID,
            process.env.COGNITO_CLIENT_SECRET
        );

        const params = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: email,
            Password: password,
            SecretHash: secretHash,
            UserAttributes: [
                { Name: "email", Value: email }
            ]
        };

        await cognito.signUp(params).promise();

        return success({ message: "Signup successful. Check your email for the verification code." });

    } catch (err) {
        return error(err.message || "Signup failed", 400);
    }
};
