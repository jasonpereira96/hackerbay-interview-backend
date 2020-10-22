const jwt = require('jsonwebtoken');
const { SECRET } = require('./../constants/constants');

const login = (request, response) => {
    let { username, password } = request.body;
    const token = jwt.sign({ username, password }, SECRET, {
        expiresIn: '1h'
    });
    response.json({
        token,
        loggedIn: true
    });
};

module.exports = {
    login
};