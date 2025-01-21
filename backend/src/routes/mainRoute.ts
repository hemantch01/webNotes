import z from 'zod';
import { Router } from "express";
import { users } from '../db/usersDB';
import jwt from 'jsonwebtoken';
import {jwtPassword} from '../config/config'
const router = Router();

const signupSchema = z.object({
    email: z.string().email().min(6),
    password: z.string().min(8)
})

router.post('/signup',async (req,res)=>{
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({msg:"error in inputs(email must be valid and password min of 8 letters)"})
    }
    try{ 
        
        const isUserExist = await users.findOne({email: req.body.email,password: req.body.password})
    if(isUserExist){
        res.status(403).json({msg:"user already exist"})
    }
    else{
        const isUserCreated = await users.create(req.body);
        if(isUserCreated){
            res.status(200).json({msg:"user created success fully"});
        }
    }
    } catch(err){
    res.status(500).json({msg:"internal server error"});
    }
   
});
const signInSchema = z.object({
    email:z.string(),
    password:z.string()
})
router.post('/signin',async (req,res)=>{
    const {success} = signInSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({msg:'Invalid Inputs'});
    }
    try{
    const isUserExist = await users.findOne({
        email: req.body.email,
        password: req.body.password
    });
    const emailToSign = req.body.email;
    if(!isUserExist){res.status(403).json('email already exist')};
    const signInToken= jwt.sign({payload: {emailToSign}},jwtPassword);
    res.status(200).json({msg:'user Signin successfully',token: signInToken})
}catch(err){
    res.status(500).json({msg:'something went wrong'})
}
})

export default router;