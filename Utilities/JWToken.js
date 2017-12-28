/**
 * Created by uri on 10/28/17.
 */
const jwt = require('jsonwebtoken');
var config = require('../config');

exports.create = function(object){
        var payload = {
            data: object
        }
        var token = jwt.sign(
            payload,
            config.jwt_secret_key,
            {
                expiresIn: 864000
            }
        )
        return token
}

exports.verify = function(token, callback){
        jwt.verify(token, config.jwt_secret_key, callback)
}

