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

        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [tasks] = await conn.execute(
            "SELECT id, title, description, status, due_date, created_at FROM tasks WHERE user_id = ?",
            [userId]
        );

        await conn.end();
        return success({ tasks });

    } catch (err) {
        return error(err.message || "Failed to retrieve tasks", 500);
    }
};
