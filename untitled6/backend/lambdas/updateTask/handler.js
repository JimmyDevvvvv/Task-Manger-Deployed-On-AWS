const { success, error } = require('../../common/response');
const pool = require('../../common/db');


exports.handler = async (event) => {
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const { id } = event.pathParameters;
        const { title, description, due_date, status } = JSON.parse(event.body);

        await pool.execute(
            'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE task_id = ? AND user_id = ?',
            [title, description, due_date, status, id, userId]
        );

        return success({ message: 'Task updated successfully' });
    } catch (err) {
        console.error(err);
        return error('Failed to update task');
    }
};
