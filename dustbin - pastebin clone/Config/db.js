const mongoose = require('mongoose')

require('dotenv').config()

const uri = process.env.MONGO_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('[ SUCCESS ] : Connection Established');
    })
    .catch((err) => {
        console.log(process.env.MONGO_URL);
        console.log(`[ FAIL ] : Connection Failed `);
        // res.status(500).json({ error: err });
    })

module.exports = mongoose;