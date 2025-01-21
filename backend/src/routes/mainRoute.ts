import z from 'zod';
import { Router } from "express";
import { users } from '../db/usersDB';
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
})

router.post('/signin')

export default router;