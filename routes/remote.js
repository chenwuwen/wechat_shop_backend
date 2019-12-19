let router = require('koa-router')();
let consul = require('../modules/consul_config.js');
const axios = require("axios");

/**
 * 保存注册在Consul中的所有服务
 * key 为服务名
 * value 为服务地址
 * @type {Map<any, any>}
 */
const SERVICE_COLLECTION = new Map();

/**
 * 得到注册到Consul上的所有服务
 */
router.get("/allService", async (ctx, next) => {
    let ret = await consul.getService();
    ctx.body = ret;
})

/**
 * 调用Java远程服务
 */
router.get('/javaMicroService', async (ctx) => {
    await buildServiceList();
    let path = 'http://' + SERVICE_COLLECTION.get('consul-service') + "/health"
    console.log(`请求地址：${path}`)
    let response = await axios({
        url: "/health",
        baseURL: 'http://' + SERVICE_COLLECTION.get('consul-service'),
        method: "GET",
        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    })
    // 返回的response是一个json字符串,包含了请求信息等,真正的数据在data里
    console.log(response);
    ctx.body = response.data;
})

/**
 * 调用Python远程服务
 */
router.get('/pythonMicroService', async (ctx) => {
    await buildServiceList();
    let path = 'http://' + SERVICE_COLLECTION.get('django_service') + "/health"
    console.log(`请求地址：${path}`)
    let response = await axios({
        url: "/health",
        baseURL: 'http://' + SERVICE_COLLECTION.get('django_service'),
        method: "GET",
        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    })
    // 返回的response是一个json字符串,包含了请求信息等,真正的数据在data里
    console.log(response);
    ctx.body = response.data;
})

/**
 * 组装服务列表
 * 将取到的服务列表封装到Map集合中
 * @returns {Promise<void>}
 */
async function buildServiceList() {
    let ret = await consul.getService()
    let jsonStr = JSON.stringify(ret)
    console.log(`Consul上的所有服务:${jsonStr}`);
    console.log(`返回结果类型：${typeof ret}`);
    let jsonObj = JSON.parse(jsonStr)
    let i = 0;
    for (let parseKey in jsonObj) {
        i++;
        SERVICE_COLLECTION.set(jsonObj[parseKey]['Service'], jsonObj[parseKey]['Address'] + ":"
            + jsonObj[parseKey]['Port']
        )
    }
    // JSON数组有长度json.abc.length,如果单纯是json格式，那么不能直接使用json.length方式获取长度，而应该使用其他方法
    console.log(`Consul上的服务总数:${jsonObj.keys}`);
    console.log(SERVICE_COLLECTION);
}

module.exports = router;