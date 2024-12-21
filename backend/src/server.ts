import express from "express";
import prisma from "./db"
import {request, response, NextFunction} from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import {protect, adminOnly} from "./modules/auth"
import {createNewUser, logIn, logout, checkEmailExists, storeUserInDatabase} from "./handlers/user"
import {artworksAreFetchedFromDB} from "./handlers/art"
import cookieParser from 'cookie-parser';
import helmet from "helmet";


import {fetchArt} from "../prisma/seed";


const app = express();

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


app.use('/api', router)

// we are currently only using these routes below
// we are currently only using these routes below
// we are currently only using these routes below

// this seeds the db with artwork (we should add an admin and stop seeding every time we start the server)

app.get('/', async (req: request, res: response) => {
  try {
    const artworks = await fetchArt();
    res.json(artworks);
  } catch (error) {
    console.error("Error fetching artwork:", error);
    res.status(500).json({ error: "Failed to fetch artwork" });
  }
});

// this checks if email exists while creating a new user
app.post("/signup", checkEmailExists, storeUserInDatabase);

// this creates a new user when the above request is successful
app.post('/user', createNewUser)


// this logs in the user
app.post('/login', logIn)

// this logs out the user
app.post('/logout', logout)

// this fetches the artworks from the db to show them in the dashboard if the user is just a user
app.get('/artworks', artworksAreFetchedFromDB);

// check user role when accessing the dashboard
app.get('/dashboard', protect, (req, res) => {
  const { id, username, role } = req.user;

  // Return the user's details for the frontend to handle
  res.json({ id, username, role });
});

app.get('/admin/users', protect, adminOnly, async (req, res) => {
  try {
      const users = await prisma.user.findMany();
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
  }
});

export default app;