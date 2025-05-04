const AWS = require("aws-sdk");
const { success, error } = require("../../common/response");
const { getSecretHash } = require("../../utils/secretHash");
require("dotenv").config();
console.log("🧠 ENV Loaded:");
console.log("CLIENT ID:", process.env.COGNITO_CLIENT_ID);
console.log("CLIENT SECRET:", process.env.COGNITO_CLIENT_SECRET);

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: process.env.AWS_REGION || "eu-north-1",
});

exports.handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body || "{}");

        if (!email || !password) {
            return error("Email and password are required", 400);
        }

        const secretHash = getSecretHash(
            email,
            process.env.COGNITO_CLIENT_ID,
            process.env.COGNITO_CLIENT_SECRET
        );

        const params = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: secretHash,
            },
        };

        const data = await cognito.initiateAuth(params).promise();

        return success({
            message: "Login successful",
            idToken: data.AuthenticationResult.IdToken,
            accessToken: data.AuthenticationResult.AccessToken,
            refreshToken: data.AuthenticationResult.RefreshToken,
        });

    } catch (err) {
        return error(err.message || "Login failed", 401);
    }
};
