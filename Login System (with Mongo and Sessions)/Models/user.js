const mongoose = require('../config/db');
const bcrypt = require('bcrypt');
const AppError = require('../AppError')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username name can\'t be blank'],
    },
    password : {
        type: String,
        required: [true , 'Password can\'t be blank.'],
    },
})

UserSchema.pre('save' , async function(next){
    // if(!this.isModified('password')) return next();
    // console.log(this.username, this.password)
    const hashPassword = await bcrypt.hash(this.password, 12);
    this.password = hashPassword;
    next();
})

module.exports = mongoose.model('User', UserSchema)