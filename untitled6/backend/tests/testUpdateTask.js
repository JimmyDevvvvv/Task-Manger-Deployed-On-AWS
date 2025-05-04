require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const fs = require("fs");
const path = require("path");
const { handler } = require("../lambdas/updateTask/handler");

const { idToken } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "token.json"), "utf8"));

const event = {
    headers: {
        Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({
        taskId: 3, // Replace with actual task ID you own
        title: "OVER AND OVER AGAINNNN 🔥",
        description: "t3arf ta3mel keda?",
        status: "In Progress", // Could be "Pending", "Completed", etc.
        due_date: "2025-05-10" // Optional, can be null
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
