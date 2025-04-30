const { success, error } = require('../../common/response');
const pool = require('../../common/db');


exports.handler = async (event) => {
    try {
        const userId = event.requestContext.authorizer.claims.sub; // Cognito User ID

        const [tasks] = await pool.execute(
            'SELECT task_id, title, description, due_date, status, created_at FROM tasks WHERE user_id = ?',
            [userId]
        );

        return success({ tasks });
    } catch (err) {
        console.error(err);
        return error('Failed to retrieve tasks');
    }
};
