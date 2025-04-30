// Load environment variables
process.chdir(__dirname);
//StrongPass123!
require('dotenv').config();

// Import the Lambda handler
const { handler } = require('./lambdas/getTasks/handler');

// Simulate API Gateway event (mimic Cognito-authenticated user)
const event = {
    requestContext: {
        authorizer: {
            claims: {
                sub: 'dummy-user-id-1234' // simulate a logged-in user id
            }
        }
    }
};

// Invoke the Lambda locally
handler(event)
    .then(response => {
        console.log("Lambda Response:", response);
    })
    .catch(err => {
        console.error("Lambda Error:", err);
    });
