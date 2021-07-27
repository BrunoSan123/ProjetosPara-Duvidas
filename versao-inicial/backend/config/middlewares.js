const bodyParser =require('body-parser')
const cors =require('cors')

module.export = app =>{
      bodyParser.urlencoded({ extended: true })
      app.use(bodyParser.json())
      app.use(cors)
}

