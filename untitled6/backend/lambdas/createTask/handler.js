const { success, error } = require('../../common/response');
const pool = require('../../common/db');

exports.handler = async (event) => {
    try {
        const { title, description, due_date } = JSON.parse(event.body);
        const [rows] = await pool.execute(
            'INSERT INTO tasks (title, description, due_date, status) VALUES (?, ?, ?, ?)',
            [title, description, due_date, 'Pending']
        );

        return success({ message: "Task created", taskId: rows.insertId });
    } catch (err) {
        console.error(err);
        return error("Failed to create task");
    }
};
