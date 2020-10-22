const jwt = require('jsonwebtoken');
const { SECRET } = require('./../constants/constants');

const authorize = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return response.sendStatus(401);
    }
    jwt.verify(token, SECRET, (error, decoded) => {
        if (error) {
            return response.sendStatus(403);
        }
        next();
    });
};

module.exports = {
    authorize
};