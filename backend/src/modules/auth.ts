import jwt from "jsonwebtoken"
import {request, response, NextFunction} from "express";
import bcrypt from "bcrypt"



export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
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
    const token = req.cookies.token; // Raw token from the cookie

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return; 
    }

    try {
        // Verify and decode the token
        const user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

        // check if the token is valid
        if (!user) {
            res.status(401).json({ message: 'Invalid token' });
            return; 
        }

        // Check if the user has the correct role
        if (user.role !== 'ADMIN') {
            res.status(403).json({ message: 'You are not allowed to see this page' });
            return; 
        }

        // Attach the user payload to the request for further use
        req.user = user;
        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ message: 'Invalid token' });
    }
};