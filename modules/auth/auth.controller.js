const _ = require('lodash');
var { User } = require('./../../models/user');

/**
 * @api {post} /auth Login
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {"_id":"58a9b4c77f2ce72c6748c672","email":"anoop.pr@experionglobal.com","name":"Anoop P R"}
 */
var login = (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken()
            .then((token) => res.header('x-auth', token).return(user))
            .catch((e) => Promise.reject(e));
    }).catch((e) => res.status(401).message('user-invalid-credentials').return(e));
}


/**
 * @api {delete} /auth Logout
 * @apiName Logout
 * @apiGroup Auth
 *
 * @apiHeader {String} x-auth Users unique access-key.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
var logout = (req, res) => {
    req.user.removeToken(req.token)
        .then(() => res.status(200).return())
        .catch((e) => res.status(400).return(e));
}

module.exports = { login, logout };
