var settings = require('../../settings.js');
var logConfigOptions = {
    //logDirectory: './client/assets/log',
    logDirectory: './client',
    fileNamePattern: 'roll-<DATE>.log',
    dateFormat: settings.dateFormat
};
module.exports =
    {
        //database config
        "environment": {
            "dialect": "mysql",
            "username": settings.environmentUserName,
            "password": settings.environmentPassword,
            "database": settings.environmentDatabase,
            "host": settings.environmentHost,
            "pool": {
                "max": 5,
                "min": 0,
                "idle": 10000
            },
            port: settings.environmentPort,
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
        "localDevelopment": {
            "dialect": "mysql",
            "username": "root",
            "password": "root",
            "database": "DCC2",
            "host": "127.0.0.1",
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
            url: settings.LDAPurl,
            bindDn: 'cn=admin,dc=example,dc=com',
            bindCredentials: '123456',
            searchBase: 'dc=example,dc=com',
            searchFilter: '(mail={{username}})'
        },
        //Log config
        "log": require('simple-node-logger').createLogManager(logConfigOptions).createLogger()
    }
