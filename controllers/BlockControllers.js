const axios = require('axios');
var Block = require('../models/BLock');

exports.getAllBlocks = function (req, res, next) {
    console.log('getting blocks...')
    axios.get('https://api.kcoin.club/blocks?limit=2').then(result=>{
        Block.addNewBlockItem(result.data, (err, rls)=>{
            if(err)
                res.send(err)
            else
                res.send(rls)
        })
    })
};

