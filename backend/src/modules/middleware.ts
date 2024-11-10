import {request, response, NextFunction} from "express";
import {validationResult} from "express-validator"



export const handleInputErrors = (req: request, res: response, next) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.status(400);
        res.json({errors: errors.array()});
    } else{
        next();
    }

}


