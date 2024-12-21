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
        role: user.role,
        email: user.email,
        profilePicture: user.profilePicture 
    }, 
    process.env.JWT_SECRET, 
    { algorithm: 'HS256', expiresIn: '1h' });

return token

}


export const protect = (req: request, res: response, next) => {
    const token = req.cookies.token; // Raw token from the cookie


    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify and decode the token
        const user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Attach the user payload to the request for further use
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'You are not allowed to access this page' });
    }
    next();
};