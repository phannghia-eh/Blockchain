var jwt = require('../Utilities/JWToken');

function verifyToken(req, res, next){
    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, function(err, decoded) {
            if (err) {
                console.log(err)
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                console.log(decoded)
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}
module.exports = verifyToken;