import mongoose from "mongoose";
mongoose.connect('connection string');

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

