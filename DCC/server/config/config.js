
var logConfigOptions = {
    //logDirectory: './client/assets/log',
    logDirectory: './client',
    fileNamePattern: 'roll-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
};
module.exports =
    {
        //database config
        "development": {
            "dialect": "mysql",
            "username": "root",
            "password": "dekvn@123321",
            "database": "DCC2",
            "host": "192.168.122.23",
            "pool": {
                "max": 5,
                "min": 0,
                "idle": 10000
            },
            port: 3306,
            "logging": false
        },
        "test": {
            "dialect": "mysql",
            "username": "root",
            "password": "root",
            "database": "dcc_test",
            "host": "127.0.0.1",
            "storage": "test_database.sqlite",
            "pool": {
                "max": 5,
                "min": 0,
                "idle": 10000
            },
            port: 3311,
            "logging": false
        },
        "production": {
            "dialect": "mysql",
            "username": "root",
            "password": "dekvn@123321",
            "database": "DCC2",
            "host": "192.168.122.23",
            "pool": {
                "max": 5,
                "min": 0,
                "idle": 10000
            },
            port: 3306,
            "logging": false
        },
        "inMemoryDB": {
            dialect: "sqlite",
            storage: "database/database.sqlite"
        },
        // LDAP server config , port 389
        server: {
            url: 'ldap://192.168.122.20:389',
            bindDn: 'cn=admin,dc=example,dc=com',
            bindCredentials: '123456',
            searchBase: 'dc=example,dc=com',
            searchFilter: '(mail={{username}})'
        },
        //Log config
        "log": require('simple-node-logger').createLogManager(logConfigOptions).createLogger()
    }
