var settings = {
	// This is Comment
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
    //LDAPurl: 'ldaps://192.168.122.20:636',
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
        "USER_ACCESS_TOKEN": "ya29.GlsrBHekNjK-vsiQN7ZtuyXa8QVdds_hs4sSJJzHWYAgST1JMSsjrxpoN2ZBfWSDVhZLCyXQwIZOmYpUc3F-p99_dG4eegVy1QbDP8GsqVkVm9UU32iys3GP1Klb",
        "USER_REFRESH_TOKEN": "1/zjzjkdiE1ympZLRQ0qhi3vybO4u3mm_o4gbcZLq5PYg"
    },

    /**       
    *---------- NOTIFICATION EMAIL TIME ------------
    */
    NotificationEmailTime: '10:45',   // hour:minute,  24h format
};
module.exports = settings;
