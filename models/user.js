var mongoose = require('mongoose'),
PassportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);