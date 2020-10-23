const express = require('express');
const router = express.Router();
const patch = require('./../controllers/patch').patch;
const login = require('./../controllers/login').login;
const thumbnail = require('./../controllers/thumbnail').thumbnail;
const { thumbnail: thumbnailValidator,
    patch: patchValidator,
    login: loginValidator,
} = require('./../middleware/validation');
const { authorize } = require('./../middleware/authorization');

router.get('/', function (request, response, next) {
    response.render('index', { title: 'Express' });
});
router.post('/login', loginValidator, login);
router.post('/patch', authorize, patchValidator, patch);
router.post('/thumbnail', authorize, thumbnailValidator, thumbnail);

module.exports = router;
