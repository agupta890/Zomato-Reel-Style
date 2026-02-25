require('dotenv').config()
const express = require('express')
const router = require('./routes/auth-routes')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api',router)

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
console.log(`Server is running on port ${PORT}`)
})