require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const fs = require("fs");
const path = require("path");
const { handler } = require("../lambdas/getTasks/handler");

const { idToken } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "token.json"), "utf8"));

const event = {
    headers: {
        Authorization: `Bearer ${idToken}`
    }
};

handler(event)
    .then(res => {
        const body = JSON.parse(res.body);
        if (res.statusCode === 200) {
            console.log("✅ Tasks Retrieved:");
            console.table(body.tasks);
        } else {
            console.error("❌", body.error);
        }
    })
    .catch(err => {
        console.error("💥 Exception:", err.message);
    });
