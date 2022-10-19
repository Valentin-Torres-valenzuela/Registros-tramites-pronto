const jwt = require('jsonwebtoken')

let config = process.env;

let verifyToken = function (req, res, next) {

    let token = req.body.token || req.query.token || req.headers["x-access-token"];

    try {
        if (!token) res.status(401).json('No estás en sesión')
        var decoded = jwt.verify(token, config.JWT_KEY);

        req.user = decoded;

        next();
    }
    catch (err) {
        if (err.message.includes('jwt')) {
            res.status(401).json('No estás en sesión')
        }
    }
};

module.exports = verifyToken;