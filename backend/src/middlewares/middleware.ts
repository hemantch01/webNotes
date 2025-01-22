import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtPassword } from "../config/config";

export default function signInMiddleWare(req:Request,res:Response,next:NextFunction){
    const header = req.headers.authorization;
    const decoded = jwt.verify(header as string,jwtPassword);
    if(!decoded){
        res.status(400).json({msg:'not valid user'})
    }
    req.userId = (decoded as JwtPayload).id;    
    next();
}