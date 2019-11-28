let router = require('koa-router')();

// 为该router配置统一前缀(只针对当前router有效,当声明其他router时,则需要自行配置 如：let router2 = require('koa-router')();),访问形式 xxx/users/xxx
router.prefix('/users');

/**
 * ctx:context 对象，表示一次对话的上下文（requset和response）
 * next: next 函数，调用 next 函数可以把执行权交给下一个中间件，下一个中间件执行完会把执行权再交回上一个中间件。
 * 如果中间件中有异步操作，需要使用 async、await 关键字，将其写成异步函数
 */
router.get('/', function (ctx, next) {
    ctx.body = 'this is a users response!';
    next()
});

router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response!';
});

let router2 = require('koa-router')();
router2.get("/test", function (ctx, next) {
    ctx.body = "router2不受前缀影响"
})

// 一个js中只能导出一个router,后面导出的会覆盖前面导出的
module.exports = router;
// module.exports = router2;