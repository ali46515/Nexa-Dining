import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = 3000

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT)
})
