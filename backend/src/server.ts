import express from "express";
import {request, response, NextFunction} from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import {protect} from "./modules/auth"
import {createNewUser, signIn} from "./handlers/user"
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());



app.get('/', (req: request, res: response) => {
    res.json({message: "sup, this is the security exam project. its very safe"})
});

app.use('/api', protect, router)
app.post('/user', createNewUser)
app.post('/signin', signIn)

export default app;