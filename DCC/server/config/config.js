var settings = require('../../settings.js');
//var basicAuth=require('basic-auth');
var fs=require('fs');
var logConfigOptions = {
    logDirectory: settings.logDirectory,
    fileNamePattern: settings.fileNamePattern,
    dateFormat: settings.dateFormat
};
module.exports =
    {
        //database config
        "environment": {
            "dialect": "mysql",
            "username": settings.databaseUserName,
            "password": settings.databasePassword,
            "database": settings.databaseName,
            "host": settings.databaseHost,
            "pool": {
                "max": 5,
                "min": 0,
                "idle": 10000
            },
            port: settings.databasePort,
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
            storage: "test/IMDB/database.sqlite"
        },
        // LDAP server config , port 636
        /*server: {
            url: settings.LDAPurl,
            bindDn: 'cn=admin,dc=dcc,dc=com',
            bindCredentials: 'root',
            searchBase: 'dc=dcc,dc=com',
            searchFilter: '(uid={{username}})',
            tlsOptions: {
                ca:[
                    fs.readFileSync('/etc/ssl/private/ldap01_slapd_key.pem'),
                    ],   
            
            },
        },*/

        server: {
            url: 'ldaps://192.168.122.20:636',
            bindDn: 'cn=admin,dc=dcc,dc=com',
            bindCredentials: 'root',
            searchBase: 'dc=dcc,dc=com',
            searchFilter: '(uid={{username}})',
            tlsOptions: {
                ca:[
                    fs.readFileSync('/etc/ssl/certs/ca-certificates.crt'),
                    ],   
            
            },
        },
        //credentialsLookup: basicAuth,
        //Log config
        "log": require('simple-node-logger').createLogManager(logConfigOptions).createLogger()
    }
