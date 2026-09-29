const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    // "passport-local-mongoose" will by default add a username, hash and salt field to store 
    //  the username, the hashed password and the salt value.
    //  That's why in schema we are storing only email........
    //  Additionally, Passport-Local Mongoose adds some methods to your Schema.
});

UserSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model("User", UserSchema);