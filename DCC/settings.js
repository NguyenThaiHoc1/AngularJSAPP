var settings = {
    
    /**       
    / ---------- DATABASE CONFIG ------------
    */
    // Host config
    environmentHost : "192.168.122.20",
    
     // Port config
    environmentPort : 3306,

    //Username Config
    environmentUserName: "root",

    //Password Config
    environmentPassword: "dekvn@123321",

    //Database Config
    environmentDatabase: "DCC2",

    /**       
    *---------- LDAP SERVER CONFIG ------------
    */
    //LDAP URL config, port 389
    LDAPurl : 'ldap://192.168.122.20:389',


    /**       
    *---------- LOG CONFIG ------------
    */
    //dateFormat in log
    dateFormat : 'YYYY.MM.DD',

};
module.exports = settings;
