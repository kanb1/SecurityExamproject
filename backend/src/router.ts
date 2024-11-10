import {Router} from "express"
import {request, response, NextFunction} from "express";
import {body, validationResult} from "express-validator";
import {handleInputErrors} from "./modules/middleware";

const router = Router()

// get all books
router.get('/book', (req: request, res: response) => {
    res.json({message: "hello"})
})

// get book by id
router.get('/book/:id', () => {
})

// update book by id
router.put('/book/:id', body('name').isString(), handleInputErrors, (req: request, res: response) => {

})

// create a book
router.post('/book', () => {
})

// delete a book
router.delete('/book/:id', () => {
})

export default router;