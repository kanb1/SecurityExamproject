import jwt from "jsonwebtoken"
import {request, response, NextFunction} from "express";


export const createJWT = (user) => {
    const token = jwt.sign({
        id: user.id, 
        username: user.username, 
        role: user.role
    }, 
    process.env.JWT_SECRET
)
return token

}


export const protect = (req: request, res: response, next) => {
    const bearer = req.headers.authorization;

    if(!bearer){
        res.status(401);
        res.json({message: 'not authorized'});
        return
    }

    const [, token] = bearer.split(' ')

    if (!token){
        res.status(401);
        res.json({message: 'not valid token'});
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user
            next()
    } catch (e) {
        console.error(e);
        res.status(401);
        res.json({message: 'not valid token'});
        return
    }


}