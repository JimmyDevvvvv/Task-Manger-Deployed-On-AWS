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

        const { taskId, title, description, status, due_date } = JSON.parse(event.body || "{}");
        if (!taskId) return error("Task ID is required", 400);

        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // ✅ Step 1: Check if task belongs to the user
        const [rows] = await conn.execute(
            "SELECT user_id FROM tasks WHERE id = ?",
            [taskId]
        );

        if (rows.length === 0) return error("Task not found", 404);
        if (rows[0].user_id !== userId) return error("Forbidden: Not your task", 403);

        // ✅ Step 2: Update task
        await conn.execute(
            `UPDATE tasks 
       SET title = ?, description = ?, status = ?, due_date = ? 
       WHERE id = ?`,
            [title, description, status, due_date || null, taskId]
        );

        await conn.end();
        return success({ message: "Task updated successfully" });

    } catch (err) {
        return error(err.message || "Update failed", 500);
    }
};
