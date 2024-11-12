import prisma from "../db"
import {createJWT, hashPassword, comparePasswords} from "../modules/auth"
import {request, response, NextFunction} from "express";
import sanitizeInput from "../utils/sanitize_input"






export const signUp = async (req: request, res: response) => {
    try {
        // get information the user has written in the inputs
        const {username, email, password, repeat_password} = req.body;

        // check that the input fields are not empty
        if (!username || !email || !password || !repeat_password) {
            return res.status(400).json({message: "Please fill in all fields"});
        }

        // sanitize all iputs
        const sanitizedUsername = sanitizeInput(username.trim());
        const sanitizedEmail = sanitizeInput(email.trim());
        const sanitizedPassword = sanitizeInput(password.trim());
        const sanitizedRepeatPassword = sanitizeInput(repeat_password.trim());

        // check that the email is valid
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailPattern.test(sanitizedEmail)) {
            return res.status(400).json({message: "Please provide a valid email address"});
        }


        // check if the password and repeat password are the same
        if (password !== repeat_password) {
            return res.status(400).json({message: "Passwords do not match"});
        }

        // enforce password constraints
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
        if (!passwordPattern.test(sanitizedPassword)) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters, including one uppercase letter, one number, and one special character."
            });
        }
        
        // check that the username is valid
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({message: "Invalid username"});
        }

        // limit character length to avoid buffer overflow attacks
        const MAX_LENGTH = 30; // Adjust as needed
        if (sanitizedUsername.length > MAX_LENGTH || sanitizedEmail.length > MAX_LENGTH) {
            return res.status(400).json({message: "Input exceeds maximum allowed length"});
        }

            // if all of this amazingly works out..


    } catch (error){
        console.log(error)
    }
}



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