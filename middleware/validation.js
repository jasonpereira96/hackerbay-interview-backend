const { Joi } = require('express-validation');
const { PATTERN } = require('./../constants/constants');

const login = (request, response, next) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(4)
            .required(),
        password: Joi.string()
            .pattern(new RegExp(PATTERN))
            .required(),
    });

    const validation = schema.validate(request.body);
    if (validation.error) {
        sendError(response, validation.error);
    } else {
        next();
    }
};

const patch = (request, response, next) => {
    console.log(typeof request.body.json);
    const schema = Joi.object({
        json: Joi.object().required(),
        patch: Joi.array().required(),
    });
    const validation = schema.validate(request.body);
    if (validation.error) {
        sendError(response, validation.error);
    } else {
        next();
    }
};

const thumbnail = (request, response, next) => {
    const schema = Joi.object({
        url: Joi.string().required().uri(),
    });
    const validation = schema.validate(request.body);
    if (validation.error) {
        sendError(response, validation.error);
    } else {
        next();
    }
};

module.exports = {
    login,
    patch,
    thumbnail,
};

function sendError (response, error) {
    response.json({
        error: error.details[0].message,
    });
}
