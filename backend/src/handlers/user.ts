import prisma from "../db"
import {createJWT, hashPassword, comparePasswords} from "../modules/auth"
import {Request, Response, NextFunction} from "express";
import sanitizeInput from "../utils/sanitize_input"
import bcrypt from "bcrypt"




export const createNewUser = async (req: Request, res: Response) => {

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


export const logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
  
      // check if body is empty
      if (!email || !password) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }
  
      // check if email is valid
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }
  
      // check if password is valid
      const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_]).{8,}$/;
      if (!passwordPattern.test(password)) {
        res.status(400).json({
          error: 'Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character',
        });
        return;
      }
      
      // check if user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
      //  return res.status(400).json({ error: 'Invalid email or password' });
        res.status(400).json({ error: 'Invalid email' });
        return;
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
       // return res.status(400).json({ error: 'Invalid email or password' });
        res.status(400).json({ error: 'Invalid password' });
        return;
      }

      const token = createJWT(user)
  
      // insert jwt token into a cookie to make it more secure
      res.cookie('token', token, {
        httpOnly: true,      // now javascript cannot access it
        secure: process.env.NODE_ENV === 'production', // rely on https when in production
        maxAge: 3600000,     // 1 hour
        sameSite: 'strict',  // change to lax if we want cross-site cookie usage
      });
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
}

// check if email is already in database

export const checkEmailExists = async (req: Request, res: Response, _next: NextFunction) => {
    const email = req.body.email;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (user) {
            res.status(400).json({ message: "Email already exists. Log in." });
            return;
        }

    // Proceed to the next middleware if email does not exist
    _next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// check if email is already in database
// Added return AFTER each res.status(...).json to ensure no further code executes after sending a response - just to avoid the werid behavior
// added _next: NextFunction because TS expected more strictness

export const storeUserInDatabase = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const storeNewUser = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: await hashPassword(req.body.password),
            },
        });
    
        // Respond with a success message
        res.status(201).json({ message: "User created successfully. Please log in to continue." });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};