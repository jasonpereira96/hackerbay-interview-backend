const { applyPatch } = require('fast-json-patch');

const patch = (request, response, next) => {
    let { json, patch } = request.body;
    let result = applyPatch(json, patch).newDocument;
    response.json(result);
};

module.exports = {
    patch
};