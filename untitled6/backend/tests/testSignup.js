require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { handler } = require("../lambdas/auth/signup");

const event = {
    body: JSON.stringify({
        email: "jimmyfr6@gmail.com",
        password: "StrongPass123!" // or any strong password
    }),
};

handler(event)
    .then(res => {
        const body = JSON.parse(res.body);
        if (res.statusCode === 200) {
            console.log("✅ Signup successful:", body.message);
        } else {
            console.error("❌ Signup failed:", body.error);
        }
    })
    .catch(err => {
        console.error("💥 Exception:", err.message);
    });
