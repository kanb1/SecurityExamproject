import {Router} from "express"
import {request, response, NextFunction} from "express";

const router = Router()

// get all books
router.get('/book', (req: request, res: response) => {
    res.json({message: "hello"})
})

// get book by id
router.get('/book/:id', () => {
})

// update book by id
router.put('/book/:id', () => {
})

// create a book
router.post('/book', () => {
})

// delete a book
router.delete('/book/:id', () => {
})

export default router;