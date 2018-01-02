module.exports = {
    default_connect_string: 'mongodb://blockchain:123456789@ds133127.mlab.com:33127/blockchain',
    jwt_secret_key: '16544saf34fas1v5as4',
    allow_origin_host: 'http://localhost:3006',
    blockchain_api_host: 'https://api.kcoin.club',
    local_transaction_status: {
        pending: 'pending',
        done: 'done',
        incalid: 'invalid',
        initialization: 'initialization'
    },
    remote_transaction_status: {
        used: 'used',
        free: 'free',
    },
    balance_type:{
        real: 'real',
        actual: 'actual'
    },

}