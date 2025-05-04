require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const fs = require("fs");
const path = require("path");
const { handler } = require("../lambdas/auth/login");

const event = {
    body: JSON.stringify({
        email: "jimmyfr6@gmail.com",
        password: "StrongPass123!",
    }),
};

handler(event)
    .then(res => {
        const body = JSON.parse(res.body);
        if (res.statusCode === 200) {
            console.log("✅ Login successful. Token saved to token.json");

            // Save token data to a local file
            fs.writeFileSync(
                path.resolve(__dirname, "token.json"),
                JSON.stringify(body, null, 2),
                "utf-8"
            );

        } else {
            console.error("❌ Login Failed:", body.error);
        }
    })
    .catch(err => {
        console.error("💥 Exception:", err.message);
    });
