import express from "express";

const app = express();

app.get('/', (req, res) => {
    console.log('suppp')
    res.json({message: "hello"})
})

export default app;