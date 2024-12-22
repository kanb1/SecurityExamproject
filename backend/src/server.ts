import express from "express";
import prisma from "./db"
import path from 'path';
import {request, response, NextFunction} from "express";
import morgan from "morgan";
import cors from "cors";
import {protect, adminOnly} from "./modules/auth"
import {createNewUser, login, logout, checkEmailExists, storeUserInDatabase} from "./handlers/user"
import {artworksAreFetchedFromDB} from "./handlers/art"
import cookieParser from 'cookie-parser';
import helmet from "helmet";


import {fetchArt} from "../prisma/seed";


const app = express();

// Serve static files from the frontend/assets/images directory
app.use('/assets/images', express.static(path.join(__dirname, '../../frontend/assets/images')));

const corsOrigins = process.env.CORS_ORIGINS.split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Helmet security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "http://localhost:5500"],
        scriptSrc: ["'self'", "http://localhost:5500"],
        styleSrc: ["'self'", "http://localhost:5500"],
        imgSrc: ["'self'", "data:", "http://localhost:5500"],
        connectSrc: ["'self'", "http://localhost:3002"], // Allow API requests
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: false, // Disable for development
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// http actions logged in the terminal  
app.use(morgan('dev'))

// returns json
app.use(express.json())

// query parameters are json and not strings
app.use(express.urlencoded({extended: true}))

// makes cookie an object innstead of a string to be split
app.use(cookieParser());


// we are currently only using these routes below
// we are currently only using these routes below
// we are currently only using these routes below

// this seeds the db with artwork (we should add an admin and stop seeding every time we start the server)

app.get('/api', async (req: request, res: response) => {
  try {
    const artworks = await fetchArt();
    res.json(artworks);
  } catch (error) {
    console.error("Error fetching artwork:", error);
    res.status(500).json({ error: "Failed to fetch artwork" });
  }
});

// this checks if email exists while creating a new user
app.post("/api/signup", checkEmailExists, storeUserInDatabase);

// this creates a new user when the above request is successful
app.post('/api/user', createNewUser)

// this logs in the user
app.post('/api/login', login)

// this logs out the user
app.post('/api/logout', logout)

// this fetches the artworks from the db to show them in the dashboard if the user is just a user
app.get('/api/artworks', artworksAreFetchedFromDB);

// check user role when accessing the dashboard
app.get('/api/dashboard', protect, (req, res) => {
  const { id, username, role, profilePicture } = req.user;

  // Return the user's details for the frontend to handle
  res.json({ id, username, role, profilePicture });
});

app.get('/api/admin/users', protect, adminOnly, async (req, res) => {
  try {
      const users = await prisma.user.findMany();
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
  }
});

// admin can delete a user from issue #26
app.delete('/api/admin/users/:id', protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: id },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Route to check user session
app.get('/api/usersession', protect, (req, res) => {
  res.status(200).json({ redirect: '/frontend/src/dashboard.html' });
});

// fetch data to populate edit user profile page
app.get('/api/userprofile', protect, async (req, res) => {
  try {
    const { id, username, role, email, profilePicture } = req.user;

    // Return the user's details for the frontend to handle
    res.json({ id, username, role, email });
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
}
);


export default app;