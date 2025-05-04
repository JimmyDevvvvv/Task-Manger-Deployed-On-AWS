require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const fs = require("fs");
const path = require("path");
const { verifyToken } = require("../utils/verifyToken");

const tokenPath = path.resolve(__dirname, "token.json");

if (!fs.existsSync(tokenPath)) {
    console.error("❌ token.json not found. Run testLogin first.");
    process.exit(1);
}

const { idToken } = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

verifyToken(idToken)
    .then(decoded => {
        console.log("✅ Token is valid!");
        console.log(decoded);
    })
    .catch(err => {
        console.error("❌ Token is invalid:", err.message);
    });
