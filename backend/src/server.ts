import express from "express";
import rateLimit from "express-rate-limit";
import {Request, Response, NextFunction} from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import {protect} from "./modules/auth"
import {createNewUser, logIn, checkEmailExists, storeUserInDatabase} from "./handlers/user"
import cookieParser from 'cookie-parser';
import helmet from "helmet";


import {fetchArt} from "../prisma/seed";


const app = express();

// Definerer rate-limiter (vi vil gerne undgå bruteforcing attacks)
// Vi begrænser antallet af forespørgsler fra den samme IP-adresse
const limiter = rateLimit({
  // 15 minutter
  windowMs: 15 * 60 * 1000,
  // Max 100 requests pr. IP
  max: 100,
  message: "Der er for mange forespørgsler fra denne IP, prøv igen senere.",
});

// Vi rate limiter på alle vores routes, så vi har den globalt (senere kan vi bestemme om vi vil have det på bestemte routes såsom login/signup)
app.use(limiter);


const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

// Helmet security headers
// app.use(
//     helmet({
//       // Content Security Policy (CSP) restricts sources of content like scripts, styles, and images
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'"],           // Allows resources only from the same origin
//           scriptSrc: ["'self'"],  // Only allow scripts from the same origin
//           styleSrc: ["'self'"],   // Allow styles from the same origin and inline styles
//           imgSrc: ["'self'", "data:"],      // Images can come from the same origin or be inline images (data URIs)
//           objectSrc: ["'none'"],            // Disallow plugins, such as Flash
//           frameSrc: ["'none'"],             // Disallow iframes from any source
//         },
//       },
  
//       // HTTP Strict Transport Security (HSTS) forces HTTPS for a specified duration
//       // instead of redirect 301 because the first time it will use http
//       hsts: {
//         maxAge: 31536000,                  // Sets HSTS policy duration to 1 year (in seconds)
//         includeSubDomains: true,           // Apply HSTS to all subdomains
//       },
  
//       // Cross-Origin Opener Policy (COOP) protects against cross-origin attacks 
//       // prevents new tabs and new windows to "go back"
//       crossOriginOpenerPolicy: { policy: "same-origin" },  // Only allows pages from the same origin to share context
  
//       // Cross-Origin Resource Policy (CORP) restricts resource sharing to same-origin
//       // domain, protocol and port have to match exactly
//       crossOriginResourcePolicy: { policy: "same-origin" }, // Only allow resources to be loaded from the same origin
//     })
//   );

// http actions logged in the terminal  
app.use(morgan('dev'))

// returns json
app.use(express.json())

// query parameters are json and not strings
app.use(express.urlencoded({extended: true}))

// makes cookie an object innstead of a string to be split
app.use(cookieParser());



app.get('/', async (req: Request, res: Response) => {
  try {
    const artworks = await fetchArt();
    res.json(artworks);
  } catch (error) {
    console.error("Error fetching artwork:", error);
    res.status(500).json({ error: "Failed to fetch artwork" });
  }
});

app.use('/api', router)
app.post('/user', createNewUser)
app.post('/login', logIn)

// check if email exists
app.post("/signup", checkEmailExists, storeUserInDatabase);

export default app;