const { applyPatch } = require('fast-json-patch');

const patch = (request, response, next) => {
    const { json, patch } = request.body;
    const result = applyPatch(json, patch).newDocument;
    response.json(result);
};

module.exports = {
    patch,
};
