import {AppError}  from "../error/error.js";
import jwt from 'jsonwebtoken';
import {env} from "../config/env.js";

export function guard(req,res,next){
 try {
     //logic of check token
     const token = req.cookies.access_token
     if (!token) throw new AppError('no token provided',403);
     req.user =jwt.verify(token,env.jwt.secret);
     //req.user = payload;
     next();
 }catch(error){
     next(error);
 }

}

export function adminOnly(req,res,next){
    if (req.user?.role !== 'admin') return next(new AppError('admins only',403));
    next();
}