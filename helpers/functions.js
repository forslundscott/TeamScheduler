function titleCase(xstr){
    return xstr.charAt(0).toUpperCase() + xstr.slice(1)
}
function getAccess(){
    var ADODB = require('node-adodb');
    ADODB.debug = true;
    // Connect to the MS Access DB
    return ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\x002970\\Documents\\TeamMateDB.accdb;Persist Security Info=False;');
}
function labelFinder(xstr){
    switch(xstr){
        case 'first_name': return formData = {
                label: 'First Name',
                required: '',
                type: 'text'
            }
        case 'last_name' : return formData = {
            label: 'Last Name',
            required: '',
            type: 'text'
        }
        case 'dob': return formData = {
            label: 'Date of Birth',
            required: '',
            type: 'date'
        }
        case 'email' : return formData = {
            label: 'Email',
            required: '',
            type: 'email'
        }
        case 'gender' : return formData = {
            label: 'Gender',
            required: '',
            type: 'text'
        }
        case 'nickname' : return formData = {
            label: 'Nickname',
            required: '',
            type: 'text'
        }
    }
}
module.exports = {getAccess,titleCase,labelFinder}