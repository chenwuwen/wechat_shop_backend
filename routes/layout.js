let router = require('koa-router')();
mongoDB = require('../modules/mongo_config.js')

/**
 * 需要注意的是,有时候明明路径写对了,但却抛出了404错误,原因是post请求接收到了数据
 * 却没有没有对ctx做任何更改,response始终会是Koa默认的404 —— 即便你的后台逻辑一切正常！
 * 将ctx.body改写一下body的话，此处response返回值就是正常的200。
 */

router.get('/', async (ctx) => {
    let ret = await mongoDB.query('user', {});
    // console.log(ret);
    ctx.render("index", {
        userList: ret
    })
});

router.post('/addUser', async (ctx) => {
    // console.log(ctx.request.body);
    let ret = await mongoDB.insert('user', ctx.request.body);
    console.log(ret);
    try {
        if (ret.result.ok == 1) {
            ctx.body = {status: 1}
        }
    } catch (err) {
        ctx.body = {status: 0}
    }
});

router.get('/delUser/:_id', async (ctx) => {
    // 获取url中的动态参数
    // console.log(ctx.params._id);
    // 转换为MongoDB中的_id对象
    let id = await mongoDB.getObjectId(ctx.params._id)
    let ret = await mongoDB.remove('user', {"_id": id})
    // 不管删除成功还是失败都重定向到页面
    ctx.redirect('/layout/')
});

router.post('/udpUser', async (ctx) => {
    let id = await mongoDB.getObjectId(ctx.request.body._id)
    // 删除json中的_id属性
    delete  ctx.request.body._id
    let ret = await mongoDB.update('user', {'_id': id}, ctx.request.body);
    console.log(ret);
    try {
        if (ret.result.ok == 1) {
            ctx.body = {status: 1}
        }
    } catch (err) {
        ctx.body = {status: 0}
    }
});

router.get('/getUserDetail', async (ctx) => {
    // 获取url中的? 后的参数
    console.log(ctx.query._id);
    // 转换为MongoDB中的_id对象
    let id = await mongoDB.getObjectId(ctx.query._id)
    let users = await mongoDB.query('user', {"_id": id})

    ctx.body = users[0]
});

module.exports = router;
