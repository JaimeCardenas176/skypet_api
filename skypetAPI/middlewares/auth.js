const service = require('../services');
const mongo = require('mongoose');
const user = require('../controllers/user_controller');

module.exports.isAuth = (req, res, next) => {
    auth(req, res, next);
}

function auth(req, res, next){
    if (!req.headers.authorization) {
        return res
            .status(403)
            .jsonp({ error: 403, mensaje: 'No tiene autorización para acceder a ese recurso'});
    }

    //Authorization Bearer asd07f9asd89fasd7fasdf7a.sdaf907asdf0987asdf789.asd9807fasd0987fasd0f7
    let token = req.headers.authorization.split(" ")[1];

    service.decodeToken(token)
        .then(response => {
        req.user = response;
        next();
        })
        .catch(errorResponse => {
            res
            .status(errorResponse.status)
            .jsonp({
                error: errorResponse.status,
                mensaje: errorResponse.mensaje
            });
        });
}