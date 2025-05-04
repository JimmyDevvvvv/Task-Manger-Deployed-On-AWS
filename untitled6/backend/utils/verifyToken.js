const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
require("dotenv").config();

const client = jwksClient({
    jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) {
            return callback(err);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getKey, {
            issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
        }, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded); // Includes sub, email, etc.
            }
        });
    });
};

module.exports = { verifyToken };
