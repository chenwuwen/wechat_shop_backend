/**
 * 配置文件
 *
 */

/**
 * Mongo配置信息常量
 * node中的mongodb用户名密码是拼接在url中的
 * @type {{dbName: string, dbUrl: string}}
 */
const MONGO_CONFIG = {
    dbUrl: 'mongodb://root:kanyun@localhost:27017/',
    dbName: 'wx_shop'
}

/**
 * mysql配置信息常量
 */
const MYSQL_CONFIG = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'guns'
}

/**
 * Consul配置信息常量
 */
const CONSUL_CONFIG = {
    host: '127.0.0.1',
    port: 8500,
    promisify: true,
}

// 导出配置信息常量
module.exports = {
    MONGO_CONFIG,
    MYSQL_CONFIG,
    CONSUL_CONFIG
};