import z from 'zod';
import { Router } from "express";
import { contentsch, users } from '../db/usersDB';
import jwt from 'jsonwebtoken';
import {jwtPassword} from '../config/config'
import signInMiddleWare from '../middlewares/middleware';
const router = Router();

const signupSchema = z.object({
    email: z.string().min(8),
    password: z.string()
})

router.post('/signup',async (req,res)=>{
    const {success} = signupSchema.safeParse(req.body);
    console.log(success);
    if(!success){
        res.status(411).json({msg:"error in inputs(email must be valid and password min of 8 letters)"})
        return;
    }
    try{ 
        
        const isUserExist = await users.findOne({email: req.body.email,password: req.body.password})
    if(isUserExist){
        res.status(403).json({msg:"user already exist"})
        return;
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
    const signInToken= jwt.sign({emailToSign},jwtPassword);
    res.status(200).json({msg:'user Signin successfully',token: signInToken})
      }catch(err){
    res.status(500).json({msg:'something went wrong'})
                 }
})

router.post('/content',signInMiddleWare,async (req,res)=>{
    const type = req.body.type;
    const link = req.body.link;
    const title = req.body.title;
    const isContentSaved = await contentsch.create({
        type,
        link,
        title,
        userId: req.userId,
        tags:[]

    })
    if(isContentSaved) {
        res.status(200).json({
            message:'content added'
        })
    }
})

router.get('/content',signInMiddleWare,async (req,res)=>{
const userId = req.userId;
const content = await contentsch.find({
    userId:userId
}).populate('userid','username')
if(content){res.status(200).json({content})};
})


router.delete('/content',signInMiddleWare,async (req,res)=>{
    const contentId = req.body.contentId;
    await contentsch.deleteMany({
        contentId,
        userId: req.userId
    })
    res.json({
        msg: 'Deleted'
    })
})


export default router;