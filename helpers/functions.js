function titleCase(xstr){
    return xstr.charAt(0).toUpperCase() + xstr.slice(1)
}
function getAccess(){
    var ADODB = require('node-adodb');
    ADODB.debug = true;
    // Connect to the MS Access DB
    return ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\x002970\\Documents\\TeamMateDB.accdb;Persist Security Info=False;');
}
module.exports = {getAccess,titleCase}