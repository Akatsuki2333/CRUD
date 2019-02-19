
var express = require('express');
var Student = require("./student.js");
// 1. 创建一个路由容器,把数据都挂载到router中，最后再把router导出就可以了。
var router = express.Router();


// 渲染首页
router.get('/students', function (req, res) {
    // find函数可以直接获取到db文件的数据。
    Student.find(function (err,data) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('index.html', {
            fruits: ['apple', 'banana', 'pineapple'],
            students: data,
        })
    })
})

// 渲染添加学生页面
router.get('/students/new', function (req, res) {
    res.render('new.html');
});

// 处理添加学生请求
router.post('/students/new', function (req, res) {
    //接收的数据req.body为对象。
    //把文件中的字符串转换为对象
    // 把用户提交的数据添加到对象中再转化为字符串
    // 重新添加到db文件中。

   Student.add(req.body,function (err) {
       if (err) {
           return res.status(500).send('Server error.')
       }
       console.log(req.body) 
       res.redirect('/students');
       
   })

});

// 渲染编辑页面
router.get('/students/edit', function (req, res) {
    // 1. 在客户端的列表页中处理链接问题（地址栏需要有 id 参数）
    // 2. 获取要编辑的学生 id
    // req.query得到的是一个对象，所以要req.query.id

    // 3. 渲染编辑页面
    //    根据 id 把学生信息查出来
    //    使用模板引擎渲染页面,渲染出来的还是最开始的页面。处理编辑信息是在post里面。
    console.log(req.query);
    Student.findByID(parseInt(req.query.id),function (err,student) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('edit.html',{
            student : student,
        })
    })
});

// 处理编辑请求
router.post('/students/edit', function (req, res) {
    // 1. 获取表单数据
    //    req.body
    // 2. 更新
    //    Student.updateById()
    // 3. 发送响应
    Student.updateById(req.body,function (err) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.redirect('/students');
    })

});

// 处理删除请求
router.get('/students/delete', function (req, res) {
    // req.body 是一个数组。
    // req.query是一个对象。
    Student.deleteById(parseInt(req.query.id),function (err) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.redirect('/students');
    })
});

//最后 要导出router
module.exports = router;



