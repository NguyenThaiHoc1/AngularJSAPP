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
    testDatabase: 'inMemoryDB', // In-memory Database

    /**       
    *---------- EMAIL CONFIG ------------
    */
    // copy from consonle.developer.google
    email: {
        "USER_EMAIL": "namfsone@gmail.com",
        "USER_CLIENT_ID": "498994352858-ugq1ncq0j0tufk1jl3q4mahiirf576cf.apps.googleusercontent.com",
        "USER_CLIENT_SECRET": "6OhEtkFhtWJfvJr-d2seh3sa",
        "USER_ACCESS_TOKEN": "ya29.GlsMBKdkiBe8Ml-I8dozvd7dW-uP0UFeLCwWkrz1UACfGyiNq6LEU1s8KDbE09x_LoLjzdmnkfG1odbKX12qcoD2dTFYgqBw29G-bwh2gso-dsTn6x2Gks9mDH-I",
        "USER_REFRESH_TOKEN": "1/6UDX-C78TKdlwXALyld507KUbEXL7P5fERQRUI7R2Fg5n3H_nrJ4PVReZ6_fEpfv"
    },
};
module.exports = settings;
