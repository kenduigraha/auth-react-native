import express from 'express'
import jwt from 'express-jwt'
import config from '../config'

const app = module.exports = express.Router()

var jwtCheck = jwt({
  secret: config.secret
})

app.use('api/protected', jwtCheck)

app.get('/api/protected/sayhello', jwtCheck, (req, res) => {
  console.log(jwtCheck);
  res.status(200).send("hallo guys, you are in private room")
})
