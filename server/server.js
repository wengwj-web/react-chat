// 服务器渲染需要使用jsx语法
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import model from './model'
import path from 'path'

import React from 'react'
import { renderToString } from 'react-dom/server'
// react组件=>div
// <div data-reactroot=""><p>server render</p><p>imooc roks</p></div>

// const express = require('express')
// const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
// const model = require('./model')
// const path = require('path')


const Chat = model.getModel('chat')
const app = express()
// work with express
const server = require('http').Server(app)
const io = require('socket.io')(server)

function App() {
  return (
    <div>
      <p>server render</p>
      <p>imooc roks</p>
    </div>
  )
}

console.log(renderToString(<App></App>))


io.on('connection', function (socket) {
  socket.on('sendmsg', function (data) {
    // console.log(data)
    // 广播到全局
    // io.emit('recvmsg', data)
    const { from, to, msg } = data
    const chatid = [from, to].sort().join('_')
    Chat.create({ chatid, from, to, content: msg }, function (err, doc) {
      io.emit('recvmsg', Object.assign({}, doc._doc))
    })
  })
})

const userRouter = require('./user')

app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user', userRouter)
// 编译上线
app.use(function (req, res, next) {
  if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
    return next()
  }
  const htmlRes = renderToString(<App></App>)
  res.send(htmlRes)
  // console.log(path.resolve('build/index.html'))
  // return res.sendFile(path.resolve('build/index.html'))
})
app.use('/', express.static(path.resolve('build')))

server.listen(9093, function () {
  console.log('node app start port 9093')
}) 