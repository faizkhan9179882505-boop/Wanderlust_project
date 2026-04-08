const { required } = require('joi');
const mongoose=require('mongoose');
const schema=mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new schema({
    email:{
        type:String,
        required:true
    }
    //username aur password passportlocalmongoose automatic define kar dega 
});
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);