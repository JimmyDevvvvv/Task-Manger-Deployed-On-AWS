const mysql = require("mysql2/promise");
const { verifyToken } = require("../../utils/verifyToken");
const { success, error } = require("../../common/response");
require("dotenv").config();

exports.handler = async (event) => {
    try {
        // ✅ Extract and verify token
        const authHeader = event.headers?.Authorization || event.headers?.authorization;
        if (!authHeader) return error("Unauthorized: No token", 401);

        const token = authHeader.replace("Bearer ", "");
        const decoded = await verifyToken(token);
        const userId = decoded.sub;

        // ✅ Parse task from body
        const { title, description } = JSON.parse(event.body || "{}");
        if (!title || !description) return error("Missing task data", 400);

        // ✅ Connect to DB
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // ✅ Insert into DB
        const [result] = await conn.execute(
            "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
            [title, description, userId]
        );

        await conn.end();

        return success({ message: "Task created", taskId: result.insertId });

    } catch (err) {
        return error(err.message || "Task creation failed", 500);
    }
};
