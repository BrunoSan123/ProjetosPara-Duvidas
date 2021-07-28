const express =require('express')
const app = express()
const bodyParser =require('body-parser')
const consign = require('consign')
const db = require('./config/db')


app.db=db
app.use(bodyParser.json())

    consign()
    .then('./config/middlewares.js')
    .then('./api/validator.js')
    .then('./api/user.js')
    .then('./api/userTest.js')
    .then('./config/routes.js')
    .into(app)

    app.get('/tentativa',(req,res)=>{
        res.send('Funcionou')
    })
    


app.listen(3000,()=>{
    console.log('Beackend rodando.....')
})