require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/',(req,res)=>{
    res.send("hi")
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
console.log(`Server is running on port ${PORT}`)
})