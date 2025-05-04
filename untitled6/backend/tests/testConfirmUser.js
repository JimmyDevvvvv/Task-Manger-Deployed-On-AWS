const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const { handler } = require("../lambdas/auth/confirmUser");

// Load token from token.json
const { idToken } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "token.json"), "utf8"));

const event = {
    body: JSON.stringify({
        email: "jimmyfr6@gmail.com",
        code: "006279", // <-- Replace with real code
        idToken
    }),
};

handler(event)
    .then(res => {
        const body = JSON.parse(res.body);
        console.log(res.statusCode === 200 ? `✅ ${body.message}` : `❌ ${body.error}`);
    })
    .catch(err => {
        console.error("💥 Exception:", err.message);
    });
