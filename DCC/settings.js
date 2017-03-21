var settings = {

    /**       
    / ---------- DATABASE CONFIG ------------
    */
    //choose Host config
    databaseHost: "192.168.122.20",

    //choose Port config
    databasePort: 3306,

    //choose Username Config
    databaseUserName: "root",

    //Choose Password Config dekvn@123321 or root
    databasePassword: "dekvn@123321",

    //Choose Database Config
    databaseName: "DCC2",

    /**       
    *---------- LDAP SERVER CONFIG ------------
    */
    //LDAP URL config, port 389
    LDAPurl: 'ldap://192.168.122.20:389',


    /**       
    *---------- LOG CONFIG ------------
    */
    //choose date format
    dateFormat: 'YYYY.MM.DD',

    //choose log directory folder
    logDirectory: './client/log',

    // choose file name pattern
    fileNamePattern: 'roll-<DATE>.log',
    testDatabase: 'inMemoryDB'
};
module.exports = settings;
