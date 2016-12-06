// const express = require('express')
// const _ = require('lodash')
// const config = require('../config.json')
// const jwt = require('jsonwebtoken')

import express from 'express'
import _ from 'lodash'
import config from '../config'
import jwt from 'jsonwebtoken'

const app = module.exports = express.Router()

var users = [{
  id: 1,
  username: 'Kenduigraha',
  password: '123'
}]

let createToken = (user) => {
  return jwt.sign(_.omit(user, 'password'), config.secret, {expiresIn: 60*60})
}

let getUserSchema = (req) => {
  var username
  var type
  var userSearch = {}

  if(req.body.username){
    username = req.body.username
    type = 'username'
    userSearch = {username: username}
  }else if(req.body,email){
    username = req.body.email
    type = 'email'
    userSearch = {email: username}
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  }
}

app.post('/users/register', (req, res) => {
  var userSchema = getUserSchema(req)

  if(!userSchema.username || !req.body.password){
    return res.status(400).send("You must send the username and password")
  }

  if(_.find(users, userSchema.userSearch)){
    return res.status(400).send("A user with that username has already exist")
  }

  var profile = _.pick(req.body, userSchema.type, 'password', 'extra')
  profile.id = _.max(users, 'id').id + 1

  users.push(profile)
  res.status(201).send({
    id_token: createToken(profile)
  })
})

app.post('/users/login', (req, res) => {
  var userSchema = getUserSchema(req)
  if(!userSchema.username || !req.body.password){
    return res.status(400).send("You must send the username and password")
  }

  var user = _.find(users, userSchema.userSearch)

  if(!user){
    return res.status(401).send("The username don't match")
  }

  if(user.password !== req.body.password){
    return res.status(401).send("Your password don't match")
  }

  res.status(201).send({
    id_token: createToken(user)
  })
})
