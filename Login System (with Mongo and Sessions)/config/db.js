const mongoose = require('mongoose');

require('dotenv').config();

const uri = process.env.MONGO_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connection Established');
    })
    .catch(() => {
        console.log('Connection Fail :(')
    })

module.exports = mongoose;