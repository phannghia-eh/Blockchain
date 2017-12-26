/**
 * Created by uri on 10/27/17.
 */
const bcrypt = require('bcrypt')
class BCrypt{
    static generate(plaintext, saltRounds = 10, callback){
        bcrypt.hash(plaintext, saltRounds, callback)
    }
    static compare(plaintext, hash, callback){
        bcrypt.compare(plaintext, hash, callback)
    }
}

module.exports = BCrypt