require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const fs = require("fs");
const path = require("path");
const { handler } = require("../lambdas/uploadfile/handler");

const { idToken } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "token.json"), "utf8"));

const event = {
    headers: {
        Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({
        filename: "Smoke and mirros.txt",
        taskId: 3 // Replace with an existing task ID you own
    })
};

handler(event)
    .then(res => {
        const body = JSON.parse(res.body);
        if (res.statusCode === 200) {
            console.log("✅ Signed URL generated!");
            console.log("🧾 File Key:", body.fileKey);
            console.log("📄 Attachment ID:", body.attachmentId);
            console.log("🔗 Upload with this URL in Postman or curl:");
            console.log(body.signedUrl);
        } else {
            console.error("❌ Error:", body.error);
        }
    })
    .catch(err => {
        console.error("💥 Exception:", err.message);
    });
