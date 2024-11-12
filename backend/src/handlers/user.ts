import prisma from "../db"
import {createJWT, hashPassword, comparePasswords} from "../modules/auth"
import {request, response, NextFunction} from "express";



export const createNewUser = async (req: request, res: response) => {

    // add code to check if user already exists
    
    const user = await prisma.user.create({
        data: {
            username: req.body.username,
            email: req.body.email,
            password: await hashPassword(req.body.password)

        }
    })
    const token = createJWT(user)
    res.json({token: token})
}



export const signIn = async (req: request, res: response) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username
        }
    })

    const isValid = await comparePasswords(req.body.password, user.password)

    if(!isValid){
        res.status(401)
        res.json({message: 'nej tak'})
        return
    }

    const token = createJWT(user)

    // insert jwt token into a cookie to make it more secure
    res.cookie('token', token, {
        httpOnly: true,      // now javascript cannot access it
        secure: process.env.NODE_ENV === 'production', // rely on https when in production
        maxAge: 3600000,     // 1 hour
        sameSite: 'Strict',  // change to lax if we want cross-site cookie usage
    });

    res.json({token: token})
    
}