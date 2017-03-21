var settings = {

    /**       
    / ---------- DATABASE CONFIG ------------
    */
    databaseHost: "192.168.122.20", //127.0.0.1
    databasePort: 3306, // 3306
    databaseUsername: "root", //root
    databasePassword: "dekvn@123321", //dekvn@123321 or root 
    databaseName: "dcc_development", //dcc2

    /**       
    *---------- LDAP SERVER CONFIG ------------
    */
    LDAPurl: 'ldap://192.168.122.20:389', //192.168.122.20:389

    /**       
    *---------- LOG CONFIG ------------
    */
    dateFormat: 'YYYY.MM.DD', //YYYY.MM.DD
    logDirectory: './client/log', //directory of log files
    fileNamePattern: 'roll-<DATE>.log',

    /**       
    *---------- TEST CONFIG ------------
    */
    testDatabase: 'inMemoryDB' // in-memory database test
};
module.exports = settings;
