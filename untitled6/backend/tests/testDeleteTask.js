require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { handler } = require("../lambdas/deleteTask/handler");
const fs = require("fs");
const path = require("path");

const { idToken } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "token.json"), "utf8"));

const event = {
    headers: {
        Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({
        taskId: 1 // 🔁 Replace this with a real task ID from your DB
    })
};

handler(event)
    .then(res => {
        const body = JSON.parse(res.body);
        if (res.statusCode === 200) {
            console.log("✅", body.message);
        } else {
            console.error("❌", body.error);
        }
    })
    .catch(err => {
        console.error("💥 Exception:", err.message);
    });
