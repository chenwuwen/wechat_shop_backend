const Consul = require("consul")
consulCfg = require("./config").CONSUL_CONFIG

/**
 * https://github.com/silas/node-consul
 * Node服务注册到Consul上的注册信息
 * @type {{address: string, port: number, name: string, check: {http: string, interval: string, timeout: string}}}
 */
const CONSUL_SERVICE = {
    name: 'NODE-SERVICE', /*注册到Consul上的ServiceId*/
    address: '127.0.0.1',  /*node服务的运行地址*/
    tags: ['wechat_shop_backend'],
    port: 3000, /*node服务监听端口*/
    check: {
        http: 'http://127.0.0.1:3000/health', /*node服务的健康检查地址*/
        interval: '10s',   /*健康检查频率(必须设置)*/
        timeout: '5s'  /*健康检查超时时间*/

    }
}

/**
 * Consul实例
 * @type {Consul}
 */
const consul = new Consul(consulCfg)


/**
 * Consul注册中心配置类
 * 连接Consul注册中心
 */
class ConsulConfig {


    /**
     * 静态方法,得到类实例
     * 单例模式
     */
    static getInstance() {
        if (!ConsulConfig.instance) {
            console.log("静态方法======>初始化Consul连接");
            ConsulConfig.instance = new ConsulConfig()
        }
        console.log("静态方法======>返回已存在的Consul连接");
        return ConsulConfig.instance
    }

    /**
     * 构造方法
     */
    constructor() {
        console.log("进入Consul连接的构造方法");
        this.registerService()
    }

    /**
     * 注册服务到Consul
     */
    registerService() {
        consul.agent.service.register(CONSUL_SERVICE, (err, result) => {
            if (err) {
                console.log(`注册到Consul上报错${err}`);
                // throw err;
            }
            console.log('注册到consul成功');
        })
    }

    /**
     * 取消注册服务到Consul
     */
    deRegisterService() {
        consul.agent.service.deregister(CONSUL_SERVICE, (err, data, res) => {
            if (err) {
                console.log(`取消注册到Consul上报错${err}`);
                // 直接throw err会导致程序中断
                throw err;
            }
            console.log('取消注册到consul成功');
        })
    }

    /**
     * 获取注册到Consul中的服务列表
     */
    getService(serviceName) {
        return new Promise((resolve, reject) => {
            consul.agent.service.list((err, result) => {
                if (err) {
                    console.log('从Consul注册中心获取服务列表失败');
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }


    /**
     * 调用注册在Consul中的远程服务
     * @param serviceName
     */
    callService(serviceName) {
        consul.agent.service.caller()
    }


    /**
     * 从Consul中取到配置
     * 使用了Consul的配置中心功能
     * @param key
     * @returns {Promise<any>}
     */
    async getConfig(key) {
        let result = await consul.kv.get(key);

        if (!result) {
            return Promise.reject(key + '不存在');
        }

        return JSON.parse(result.Value);
    }

    /**
     * 读取 user 配置简单封装
     * 使用了Consul的配置中心功能
     * @param key
     * @returns {Promise<any>}
     */
    async getUserConfig(key) {
        const result = await this.getConfig('develop/user');

        if (!key) {
            return result;
        }

        return result[key];
    }

    /**
     * 更新 user 配置简单封装
     * 使用了Consul的配置中心功能
     * @param key
     * @param val
     * @returns {Promise<undefined>}
     */
    async setUserConfig(key, val) {
        const user = await this.getConfig('develop/user');

        user[key] = val;
        return consul.kv.set('develop/user', JSON.stringify(user))
    }


}

module.exports = ConsulConfig.getInstance()