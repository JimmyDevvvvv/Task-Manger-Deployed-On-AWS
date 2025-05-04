require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const fs = require("fs");
const path = require("path");
const { handler } = require("../lambdas/createTask/handler");
const { verifyToken } = require("../utils/verifyToken");

// ✅ Load token
const tokenPath = path.resolve(__dirname, "token.json");
if (!fs.existsSync(tokenPath)) {
    console.error("❌ token.json not found. Run testLogin.js first.");
    process.exit(1);
}

const { idToken } = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

(async () => {
    // ✅ Decode token and print user_id
    const decoded = await verifyToken(idToken);
    const userId = decoded.sub;
    console.log("🧠 Decoded Cognito user_id:", userId);

    // ✅ Task payload
    const task = {
        title: "i crumble when u cry",
        description: "AM GOING BACK TO 505",
    };

    const event = {
        headers: {
            Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify(task)
    };

    // ✅ Invoke Lambda
    handler(event)
        .then(res => {
            const body = JSON.parse(res.body);
            if (res.statusCode === 200) {
                console.log("✅ Task created successfully:", body);
            } else {
                console.error("❌ Failed:", body.error);
            }
        })
        .catch(err => {
            console.error("💥 Exception:", err.message);
        });
})();
