module.exports =
{
    "development": {
        "dialect": "mysql",
        "username": "root",
        "password": "dekvn@123321",
        "database": "DCC2",
        "host": "192.168.122.20",
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
        "host": "192.168.122.20",
        "pool": {
            "max": 5,
            "min": 0,
            "idle": 10000
        },
        port: 3306,
        "logging": false
    },
    "inMemoryDB":{
        dialect:"sqlite",
        storage:"database/database.sqlite"
    }
}
