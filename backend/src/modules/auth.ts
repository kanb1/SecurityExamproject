import jwt from "jsonwebtoken"
import {request, response, NextFunction} from "express";
import bcrypt from "bcrypt"



export const hashPassword = (password) => {
    return bcrypt.hash(password, 12);
}

export const comparePasswords = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}


export const createJWT = (user) => {

     // Generate a JWT token
     const token = jwt.sign({ 
        userId: user.id, 
        username: user.username, 
        role: user.role 
    }, 
    process.env.JWT_SECRET, 
    { algorithm: 'HS256', expiresIn: '1h' });

return token

}


export const protect = (req: request, res: response, next) => {
    const token = req.cookies.token;

    if (!token){
        res.status(401);
        res.json({message: 'no token provided'});
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET, {algorithms: ['HS256']});
            req.user = user
            next()
    } catch (e) {
        console.error(e);
        res.status(401);
        res.json({message: 'not valid token'});
        return
    }


}