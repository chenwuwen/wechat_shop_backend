let router = require('koa-router')();
mysql = require('../modules/mysql_config.js')

router.get('/', async(ctx) => {
     console.log("=========访问了index页面========")
     // await 同步,由于node本身就是异步的,如果查询数据库不强制同步的话,ret将返回null
     let ret = await mysql.query('select name,sex ,phone,create_time as birthday from sys_user ;',null)
     console.log(ret)
     ctx.render("index",{"userList":ret})
});


module.exports = router;
