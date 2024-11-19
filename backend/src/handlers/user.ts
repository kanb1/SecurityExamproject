import prisma from "../db"
import {createJWT, hashPassword, comparePasswords} from "../modules/auth"
import {request, response, NextFunction} from "express";
import sanitizeInput from "../utils/sanitize_input"
import bcrypt from "bcrypt"




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


export const logIn = async (req: request, res: response) => {
    const { email, password } = req.body;
  
    try {
  
      // check if body is empty
      if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // check if email is valid
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
  
      // check if password is valid
     // const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_]).{8,}$/;
     // if (!passwordPattern.test(password)) {
     //   return res.status(400).json({
     //     error: 'Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character',
     //   });
     // }
      
      // check if user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
      //  return res.status(400).json({ error: 'Invalid email or password' });
        return res.status(400).json({ error: 'Invalid email' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
       // return res.status(400).json({ error: 'Invalid email or password' });
        return res.status(400).json({ error: 'Invalid password' });
      }

      const token = createJWT(user)
  
      // insert jwt token into a cookie to make it more secure
      res.cookie('token', token, {
        httpOnly: true,      // now javascript cannot access it
        secure: process.env.NODE_ENV === 'production', // rely on https when in production
        maxAge: 3600000,     // 1 hour
        sameSite: 'Strict',  // change to lax if we want cross-site cookie usage
      });
      
      res.json({
        redirect: '/frontend/src/dashboard.html',
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

export const checkEmailExists = async (req: request, res: response, next) => {
    const email = req.body.email;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user) {
            return res.status(400).json({ message: "Email already exists. Log in." });
        }

        // Proceed to the next middleware "storeUserInDatabase" if email is available
        next();


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// check if email is already in database

export const storeUserInDatabase = async (req: request, res: response, next) => {
    try {
        const storeNewUser = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: await hashPassword(req.body.password)
            }
        })
    
        // Respond with a success message
        return res.status(201).json({ message: "User created successfully. Please log in to continue." });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// return a list of all users
export const getAllUsers = async (req: request, res: response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}
