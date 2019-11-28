const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectID;
dbCfg = require('./config').MONGO_CONFIG

/**
 * 关于mongo中的角色
 * Read：允许用户读取指定数据库
 * readWrite：允许用户读写指定数据库
 * dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
 * userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户
 * clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
 * readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
 * readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
 * userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
 * dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
 * root：只在admin数据库中可用。超级账号，超级权限
 */

/**
 * 连接mongo类
 */
class MongoConfig {

    /**
     * 静态方法 单例模式
     * 连接数据库比较耗费性能
     * 解决 多次实例化时 实例不共享[即 数据库连接不共享]
     * @returns {MongoConfig}
     */
    static getInstance() {
        if (!MongoConfig.instance) {
            console.log("静态方法======>初始化数据库连接");
            MongoConfig.instance = new MongoConfig()
        }
        console.log("静态方法======>返回已存在的数据库连接");
        return MongoConfig.instance
    }

    /**
     * 构造方法
     */
    constructor() {
        console.log("进入数据库连接的构造方法");
        /*属性,存放db对象*/
        this.db = ''
        /*初始化连接数据库*/
        this.connect()
    }

    /**
     * 连接数据库
     */
    connect() {
        console.log("开始连接数据库");
        return new Promise((resolve, reject) => {
            // var _that = this
            if (!this.db) {  /*解决同一个实例下的数据库多次连接的问题,这里使用this是需要注意上面需要使用箭头函数否则用that*/
                // authSource: 'admin' 表示在admin数据库认证,因为我没有单独为我使用的数据库设置密码
                MongoClient.connect(dbCfg.dbUrl, {authSource: 'admin', useNewUrlParser: true}, (err, client) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log("连接方法======》数据库连接成功");
                        let dbClient = client.db(dbCfg.dbName);
                        this.db = dbClient
                        resolve(this.db)
                    }

                })
            } else {
                console.log("连接方法======》返回数据库连接对象");
                resolve(this.db)
            }

        })
    }

    /**
     * 查询
     * @param collectionName  查询集合名
     * @param condition  查询条件,json格式
     * @returns {Promise}
     */
    query(collectionName, condition) {
        return new Promise((resolve, reject) => {
                this.connect().then((db) => {
                        let result = db.collection(collectionName).find(condition)
                        result.toArray(function (err, docs) {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(docs)
                            }
                        })
                    }
                )
            }
        )

    }

    /**
     * 插入
     * @param collectionName 集合名
     * @param data  待插入的数据
     * @returns {Promise}
     */
    insert(collectionName, data) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertOne(data, (err, ret) => {
                    if (!err) {
                        resolve(ret)
                    } else {
                        reject(err)
                    }
                })
            })
        })
    }

    /**
     * 更新
     * @param collectionName 集合名
     * @param oldData  查找条件
     * @param newData  待更新的新值
     * @returns {Promise}
     */
    update(collectionName, oldData, newData) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                //db.user.update({},{$set:{}})
                db.collection(collectionName).updateOne(oldData, {
                    $set: newData
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })

            })

        })

    }

    /**
     * 删除
     * @param collectionName 集合名
     * @param condition  查询条件
     * @returns {Promise}
     */
    remove(collectionName, condition) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).removeOne(condition, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }

    /**
     * mongodb里面查询 _id 把字符串转换成对象
     * 获取ObjectID mongodb里面查询 _id 时 不能直接使用 {_id:'xxx'},而是需要将_id 包装一下{_id:"ObjectId('xxx')"}
     * 这样在使用时 DB.find('集合名',{_id:DB.getObjectId(xxx)})
     * @param id
     */
    getObjectId(id) {
        return new ObjectID(id);
    }
}


// Mongo.getInstance().query('user', {}).then((data) => {
//     console.log(data)
// })

// module.exports = MongoConfig.getInstance()

