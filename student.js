// 这个文件封装的方法只是为了得到 dp.json 中的数据，用来给 router 使用。
// 但由于 readFire 是异步操作，所以要获取数据要通过 回调函数 callback 来获取。

// 异步操作，封装异步 API

var fs = require('fs');
var dbPath = './db.json';

// 获取学生
exports.find = function (callback) {
    fs.readFile(dbPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, JSON.parse(data).students);
    });

};

// 把id找出来并给其他的函数用，这时候就要用到回调函数。
exports.findByID = function (id, callback) {
    fs.readFile(dbPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        var students = JSON.parse(data).students;
        // find函数是ES6语法，用来遍历数组。参数是一个函数，item就是数组中所有的值。
        var result = students.find(function (item) {
            return id === parseInt(item.id);
        });
        callback(null, result);
    });
}


// 添加学生
exports.add = function (reqBody, callback) {
    //接收的数据req.body为对象。
    //把文件中的字符串转换为对象
    // 把用户提交的数据添加到对象中再转化为字符串
    // 重新添加到db文件中。
    fs.readFile(dbPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err)
        }
        var students = JSON.parse(data).students;
        reqBody.id = students[students.length - 1].id + 1;
        students.push(reqBody);

        // 把数据添加回文件中是添加一个对象进去。
        var fileData = JSON.stringify({
            students: students
        })
        fs.writeFile(dbPath, fileData, function () {
            if (err) {
                return callback(err)
            }
            callback(null);
        })
    })

};

// 编辑更新学生对象
exports.updateById = function (student, callback) {
    // 通过find函数找出id 那个数据对象，然后用遍历替换掉原来的数据。
    fs.readFile(dbPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // students是一个数组，是所有学生的信息。
        var students = JSON.parse(data).students;
        student.id = parseInt(student.id);
        // find方法会返回一个符合条件的对象。{id : 1, name :'XX' , age : 18},现在把age 改成12
        var match = students.find(function (item) {
            return parseInt(item.id) === student.id;
        })

        // 对象赋值给对象，student是单个学生旧信息。
       for(var k in student) {
           match[k] = student[k];
       }

       // 更新后的数组中的某个对象发生了更新，不会改变原来数组的长度。要把更新后的数组转为字符串，重新放入json.db中
        var fileData = JSON.stringify({
            students : students,
        })
       fs.writeFile(dbPath,fileData,function (err) {
           if (err){
               callback(err);
           }
           // 成功就没错，所以错误对象是 null,不用拿数据了。
           callback(null);
       })
    })
}
// 删除学生
exports.deleteById = function (id,callback) {
    // 1.拿到数据库数据中的集合
    // 2.删除掉相应的数据
    // 3.把最新的集合返回数据库
    fs.readFile(dbPath,'utf8',function (err,data) {
        if (err){
            callback(err);
        }
        var students = JSON.parse(data).students;
        // 根据id找到要删除的对象的下标
        var DelIndex = students.findIndex(function (item) {
            return id === parseInt(item.id);
        })
        students.splice(DelIndex,1);
        var FileData = JSON.stringify({
            students : students,
        })
        fs.writeFile(dbPath,FileData,function (err) {
            if (err){
                callback(err);
            }
            callback(null);
        })


    })
};
