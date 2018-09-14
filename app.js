const Koa = require('koa')
const Router = require('koa-router')
const path = require('path')
const session = require('koa-session')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const art_template = require('koa-art-template');

/**
 * 实例化Koa
 */
const app = new Koa()
/**
 * 引入实例化路由
 */
const router = new Router()

/**
 * 配置Koa-Session中间件参数
 */
app.keys = ['some secret hurr']; /*cookie的签名*/
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days)
    overwrite: true, //是否可以 overwrite (默认 default true)
    httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认 true
    rolling: false, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
    renew: false, //(boolean) renew session when session is nearly expired,
};

/**
 * koa-art-template 引擎配置
 */
art_template(app, {
    root: path.join(__dirname, 'views'), /*视图位置*/
    extname: '.html', /*后缀名*/
    debug: process.env.NODE_ENV !== 'production'  /*是否开启调试模式*/
});

/**
 * Koa中间件,与Express不同的是,Koa的中间件会在路由前执行,不管书写顺序如何
 * 属于应用级中间件
 * app.use() 可以由两个参数,两个参数,表示匹配某个路由,一个参数表示匹配所有路由
 */
app.use(async(ctx, next) => {
    // console.log("Koa中间件----->进入路由之前-----执行-----》")
    // 下面这行代码表示在中间件配置公共的信息,那么在任何路由都可以访问到这个属性
    ctx.state.info = "《看云》"
    /*当前路由匹配完成后继续向下匹配,如果不写next则不会向下面匹配*/
    await next()
    // console.log("Koa中间件----->路由完成之后-----执行--------》");
    /*koa设置cookie不需要安装第三方组件*/
    ctx.cookies.set('name', 'kanyun', {
        maxAge: 60 * 60 * 1000
    })
    ctx.session.name='陈无问'
    // console.log(ctx.session.name)
    let user = ctx.cookies.get('name')
    // console.log(user);
})

/**
 * 配置路由
 * ctx 上下文 context 包含了request和response等信息
 */

router.get("/", async(ctx) => {
    // 返回数据,相当于 原生里面的res.writeHead() res.send()
    ctx.body = '首页'
})

/**
 * 配置层级路由
 */
const index = require("./routes/index.js")
router.use("/index", index.routes())

const search = require("./routes/search.js")
router.use("/search", index.routes())

const layout = require("./routes/layout.js")
router.use("/layout", layout.routes())

/**
 * 引入Koa第三方中间件
 * router.allowedMethods()作用：这是官方文档推荐的用法 router.allowedMethods()
 * 用在了路由匹配router.routers()之后,所以当所有路由中间件最后调用,此时根据 ctx.status设置response响应头
 */
app
    .use(bodyParser()) /*引入bodyparser获取post数据 ctx.body = ctx.request.body 需要注意的是：badyparser中间件要放到router前面调用,否则无法获取前台传过来的值*/
    .use(router.routes())  /*启动路由*/
    .use(router.allowedMethods()) /*可以配置也可以不配置*/
    // 不使用ejs模板引擎使用高性能art模板引擎
    // .use(views('__dir', {extension: 'ejs'}))  /*应用ejs模板引擎,dir表示模板目录,模板的后缀名必须是ejs,app.use(views('views', { map: {html: 'ejs' }}));   //这样配置也可以  注意如果这样配置的话 模板的后缀名是.html*/
    .use(static(path.join(__dirname, 'public'))) /*设置静态资源文件路径,设置好后在页面模板中引用静态资源,就不用写全路径了,只写上public后面的路径*/
    .use(session(CONFIG, app)); /*启用session*/

/**
 * 监听端口 使用Koa生成器的话,端口配置在了bin/www.js中，默认端口3000
 */
// app.listen(3000)

module.exports = app;
