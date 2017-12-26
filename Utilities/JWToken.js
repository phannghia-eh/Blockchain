/**
 * Created by uri on 10/28/17.
 */
const jwt = require('jsonwebtoken')

class JWToken{
    static create(object){
        let payload = {
            data: object
        }
        let token = jwt.sign(
            payload,
            config.jwt_secret_key,
            {
                expiresIn: 864000
            }
        )
        return token
    }
    static verify(token, callback){
        jwt.verify(token, config.jwt_secret_key, callback)
    }
}
module.exports = JWToken