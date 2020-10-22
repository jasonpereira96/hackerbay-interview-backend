const jwt = require('jsonwebtoken');
const { SECRET } = require('./../constants/constants');

const generateToken = ({ username, password }) => {
    return jwt.sign({
        username, password
    }, SECRET, {
        expiresIn: '1h'
    });
};

module.exports = {
    generateToken
};