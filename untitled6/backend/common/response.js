exports.success = (data = {}) => ({
    statusCode: 200,
    body: JSON.stringify(data),
});

exports.error = (message = "Something went wrong", code = 500) => ({
    statusCode: code,
    body: JSON.stringify({ error: message }),
});
