import mongoose, { Types } from "mongoose";
mongoose.connect('mongodb://localhost:27017/brainly');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        unique: true,
        trim:true,
        lowercase:true
    },
    password: {
        type: String,
        require: true,
        minLength: 8
    }
    
});

export const users = mongoose.model('users', userSchema);

const contentTypes = ['image','video','article','audio'];

const contentSchema = new mongoose.Schema({
     link:   {type:String,
              require: true},
    type:    {type:String,enum:contentTypes,require: true},
    title:   {type:String,
              require:true},
    tags:    [{type:Types.ObjectId,
            ref:'Tag'}],
    userId:{type:Types.ObjectId,
            ref:'User',
            required:true}
})
export const contentsch =  mongoose.model('contents',contentSchema);

