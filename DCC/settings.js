var settings = {
    
    /**       
    / ---------- DATABASE CONFIG ------------
    */
    //choose Host config
    environmentHost : "192.168.122.20",
    
     //choose Port config
    environmentPort : 3306,

    //choose Username Config
    environmentUserName: "root",

    //Choose Password Config dekvn@123321 or root
    environmentPassword: "dekvn@123321",

    //Choose Database Config
    environmentDatabase: "DCC2",

    /**       
    *---------- LDAP SERVER CONFIG ------------
    */
    //LDAP URL config, port 389
    LDAPurl : 'ldap://192.168.122.20:389',


    /**       
    *---------- LOG CONFIG ------------
    */
    //choose date format
    dateFormat : 'YYYY.MM.DD',

    //choose log directory folder
    logDirectory: './client/log',

    // choose file name pattern
    fileNamePattern: 'roll-<DATE>.log'
};
module.exports = settings;
