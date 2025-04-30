const { success, error } = require('../../common/response');
const pool = require('../../common/db');

exports.handler = async (event) => {
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const { id } = event.pathParameters;

        await pool.execute(
            'DELETE FROM tasks WHERE task_id = ? AND user_id = ?',
            [id, userId]
        );

        return success({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        return error('Failed to delete task');
    }
};
