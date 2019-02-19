var express = require('express');
var app = express();
var router = require('./router.js');

// 开放静态资源
app.use('/public',express.static('./public'));
app.use('/node_modules',express.static('./node_modules'));

app.engine('html',require('express-art-template'));   //当render中的模板名为html时

// body-parser配置
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// body-parser使用

app.use(router);

app.listen(3000, function () {
        console.log('3000 is running...')
})