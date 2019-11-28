const Mysql_config = require("mysql")
mysqlCfg = require("./config").MYSQL_CONFIG

/**
 * Mysql配置
 */
class MysqlConfig {
    /**
     * 静态方法 单例模式
     * 连接数据库比较耗费性能
     * 解决 多次实例化时 实例不共享[即 数据库连接不共享]
     * @returns {MysqlConfig}
     */
    static getInstance() {
        if (!MysqlConfig.instance) {
            console.log("Mysql_config 静态方法======>初始化数据库连接");
            MysqlConfig.instance = new MysqlConfig()
        }
        console.log("Mysql_config 静态方法======>返回已存在的数据库连接");
        return MysqlConfig.instance
    }

    /**
     * 构造方法
     */
    constructor() {
        console.log("Mysql_config 进入数据库连接的构造方法");
        // 连接池
        this.pool;
        /*初始化连接数据库*/
        this.connect()
    }

    /**
     * 连接数据库,创建连接池
     */
    connect() {
        console.log("创建Mysql连接池")
        console.log(mysqlCfg)
        this.pool = Mysql_config.createPool(mysqlCfg)
    }


    /**
     * 查询
     * @param {*} sql sql语句
     * @param {*} val 查询参数
     */
    query(sql, val) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    console.error("连接mysql数据库报错")
                    // 处理获取Mysql连接报错
                    reject(err)
                } else {
                    connection.query(sql, val, (err, fields) => {
                        if (err) {
                            // 处理Mysql查询报错
                            console.error("查询mysql数据库报错")
                            reject(err)
                        } else {
                            resolve(fields)
                        }
                        connection.release()
                    })
                }
            })
        })
    }

    /**
     * 插入数据
     * @param sql
     * @param val
     * @returns {Promise<unknown>}
     */
    insert(sql, val) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    console.error("连接mysql数据库报错")
                    // 处理获取Mysql连接报错
                    reject(err)
                } else {
                    connection.insert(sql, val, (err, fields) => {
                        if (err) {
                            // 处理Mysql查询报错
                            console.error("插入mysql数据库报错")
                            reject(err)
                        } else {
                            resolve(fields)
                        }
                        connection.release()
                    })
                }
            })
        })
    }

}

module.exports = MysqlConfig.getInstance()