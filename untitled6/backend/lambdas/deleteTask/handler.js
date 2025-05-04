const mysql = require("mysql2/promise");
const { verifyToken } = require("../../utils/verifyToken");
const { success, error } = require("../../common/response");
require("dotenv").config();

exports.handler = async (event) => {
    try {
        const authHeader = event.headers?.Authorization || event.headers?.authorization;
        if (!authHeader) return error("Unauthorized", 401);

        const token = authHeader.replace("Bearer ", "");
        const decoded = await verifyToken(token);
        const userId = decoded.sub;

        const { taskId } = JSON.parse(event.body || "{}");
        if (!taskId) return error("Task ID is required", 400);

        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // ✅ Step 1: Check ownership
        const [rows] = await conn.execute(
            "SELECT user_id FROM tasks WHERE id = ?",
            [taskId]
        );

        if (rows.length === 0) return error("Task not found", 404);
        if (rows[0].user_id !== userId) return error("Forbidden: Not your task", 403);

        // ✅ Step 2: Delete it
        await conn.execute("DELETE FROM tasks WHERE id = ?", [taskId]);
        await conn.end();

        return success({ message: "Task deleted successfully" });

    } catch (err) {
        return error(err.message || "Task deletion failed", 500);
    }
};
