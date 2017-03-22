var settings = {

    /**       
    / ---------- DATABASE CONFIG ------------
    */
    databaseHost: "192.168.122.20", //127.0.0.1
    databasePort: 3306, //3306
    databaseUserName: "root", // root
    databasePassword: "dekvn@123321", // dekvn@123321 or root
    databaseName: "DCC2", // dcc_development, DCC2, DCC_test

    /**       
    *---------- LDAP SERVER CONFIG ------------
    */
    LDAPurl: 'ldap://192.168.122.20:389', //192.168.122.23:389

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
    testDatabase: 'inMemoryDB' // In-memory Database
};
module.exports = settings;
