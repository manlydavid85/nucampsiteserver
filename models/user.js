const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//this auto adds username and password tote schema
const passportLocalMongoose = require('passport-local-mongoose');




const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
    type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);