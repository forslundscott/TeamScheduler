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

function dotProduct(array1, array2) {
    var output = 0.0
    for(var i=0; i<array1.length; i++){
        output += (array1[i] * array2[i])
    }
    return output
}

module.exports = {getAccess,titleCase,labelFinder,dotProduct}