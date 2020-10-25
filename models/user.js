var mongoose = require('mongoose')
var crypto = require('crypto')

let bcrypt = require('bcrypt');
const { hasUncaughtExceptionCaptureCallback } = require('process');
let saltRound = 10;

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    hash:{type:String},
    salt:{type:String},
    password: {type:String}

});

// UserSchema.methods.encryptPassword = function(password){
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// }
// UserSchema.methods.checkPassword = function(guessPassword){
//     return bcrypt.compareSync(guessPassword, this.password);
// }

// UserSchema.virtual('fullname').get(function(){
//     return this.lastname + '  ' + this.firstname
// })
UserSchema.methods.setPassword =function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha1').toString('hex')
}

UserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha1').toString('hex')
    return this.hash === hash 
};

module.exports= mongoose.model('User', UserSchema)
