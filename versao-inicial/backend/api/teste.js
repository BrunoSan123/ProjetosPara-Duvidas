const express = require('express')
const app = express()

app.get('/testesinho',(req,res)=>{
    res.send('<h1>O Teste funcionou</h1>')

})




app.listen(8000,()=>{
    console.log('server de teste funcionando')
})