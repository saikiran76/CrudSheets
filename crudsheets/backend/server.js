const express = require("express");
// const mysql = require("mysql")
const cors = require("cors")

const app = express()
app.use(cors())

const db = require('./models')

const { Spreadsheet } = require("./models")

app.get("/", (req, res)=>{
    Spreadsheet.create({
        column1: "data of c1",
        column2: "data of c2",
        column3: "data of c3"

    }).catch(err=>{
        if(err){
            res.json("Error creating sheet: ", err)
        }
    })

    return res.json({
        message: "Hello World!"
    })
} )

db.sequelize.sync().then((req)=>{
    app.listen(5000, ()=>{
        console.log("Backend server is running on port 5000")
    })

})

// app.listen(5000, ()=>{
//     console.log("Backend server is running on port 5000")
// })