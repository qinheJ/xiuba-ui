/**
 * Created by ycb on 2017/7/18.
 */
const api = require('./api');
const config = require('./config');
const logConfig = require('./logConfig');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const redis = require("redis");
const session = require('express-session');
const uid = require('uid-safe');
const app = express();
logConfig.use(app);
app.use(cookieParser());
app.use(session({
  name: 'nSession',
  secret: 'ycb',
  cookie: {maxAge: null},
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(api);
logConfig.logger.info('当前node环境变量为：' + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  // 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
  app.use(express.static(path.resolve(__dirname, '../dist')));
  // 因为是单页应用 所有请求都走/dist/index.html
  app.get('*', function (req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
    res.send(html)
  });
}
// 监听服务端口
app.listen(config.port);
logConfig.logger.info('node run success and listen on port %s', config.port);
