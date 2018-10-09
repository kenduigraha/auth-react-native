import logger from 'morgan'
import cors from 'cors'
import http from 'http'
import express from 'express'
import errorhandler from 'errorhandler'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

const app = express()

dotenv.load()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use((err, req, res, next) => {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message)
  }else{
    next(err)
  }
})

if(process.env.NODE_ENV === 'development'){
  app.use(logger())
  app.use(errorhandler())
}

app.use(require('./routes/user-routes'))
app.use(require('./routes/protected-routes'))

var port = process.env.PORT || 3001

http.createServer(app).listen(port, (err) => {
  if(err){
    console.error(err);
  }else{
    console.log(`server is running in port ${port}`);
  }
})
