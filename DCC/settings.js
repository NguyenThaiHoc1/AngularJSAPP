var settings = {

    /**       
    / ---------- DATABASE CONFIG ------------
    */
    databaseHost: "192.168.122.23", //127.0.0.1
    databasePort: 3306, //3306
    databaseUserName: "root", // root
    databasePassword: "dekvn@123321", // dekvn@123321 or root
    databaseName: "DCC2", // dcc_development, DCC2, DCC_test

    /**       
    *---------- LDAP SERVER CONFIG ------------
    */
    LDAPurl: 'ldap://192.168.122.23:389', //192.168.122.23:389

    /**       
    *---------- LOG CONFIG ------------
    */
    //choose date format
    dateFormat: 'YYYY.MM.DD',
    logDirectory: './client/log', //log file folder
    fileNamePattern: 'roll-<DATE>.log',

    /**       
    *---------- UNIT TESTING CONFIG ------------
    */
    testDatabase: 'inMemoryDB', // In-memory Database

    /**       
    *---------- EMAIL CONFIG ------------
    */
    // copy from consonle.developer.google
    email: {
        "USER_EMAIL": "dektech.dcc@gmail.com",
        "USER_CLIENT_ID": "985840088773-5s0rmeo36dd1v2h15h658c8flikvu63j.apps.googleusercontent.com",
        "USER_CLIENT_SECRET": "Zk2q9G6IDYLATjkLCB0-R9P3",
        "USER_ACCESS_TOKEN": "ya29.GlsXBKtapW12VeEXUil-kRM3vpdq6dkmY7-J00vnYbDSoNZwO86BmpOZRJm-aqX1hJvhPEvl1oNY7uoTbvHxVDkkGSUYChdcJy9pJjH6EqVc1A0YXkqymV7E972_",
        "USER_REFRESH_TOKEN": "1/boN86F0olFg8TbihDAJRPkeJWKuAWp7Ik3HSV0s3nXE"
    },
};
module.exports = settings;
