const express = require('express')
const app = express()
const router = require('./router')

app.use(express.static(__dirname + '/static'))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  //如果一个目标域设置成了允许任意域的跨域请求，这个请求又带着cookie的话，这个请求是不合法的
  //res.header('Access-Control-Allow-Credentials','true');
  if (req.method === 'OPTIONS') {
    res.end()
  } else {
    next()
  }
})
router(app)
app.use(function (req, res, next, err) {
  if (err) {
    res.json({ code: -1, message: '内部错误!' })
  } else {
    next()
  }
})
app.use(function (req, res) {
  // console.log(req.method);
  // console.log(req.originalUrl.length);
  // console.log(req.originalUrl);
  if (!res.headersSent) {
    res.json({ code: -1 })
  }
})
app.listen(4444, function () {
  console.log('模拟服务器启动! port:' + 4444)
})