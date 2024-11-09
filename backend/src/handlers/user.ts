import prisma from "../db"
import {createJWT, hashPassword, comparePasswords} from "../modules/auth"
import {request, response, NextFunction} from "express";



export const createNewUser = async (req: request, res: response) => {
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
    res.json({token: token})

}