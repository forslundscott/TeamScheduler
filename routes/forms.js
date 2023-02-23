const express = require("express")
// const app = express()
const router = express.Router()
router.use(express.urlencoded({ extended: true }))
const functions = require('../helpers/functions')
var connection = functions.getAccess()


// express().use(logger)
// function logger(req, res, next){
//     console.log('test form logger')
//     console.log(req.body)
//     next()
// }
router.get('/form', async (req,res)=>{
    // var connection = functions.getAccess()
    console.log(req.body)
    var data = Object.keys((await connection.query('SELECT TOP 1 * FROM [' + req.body.table +']'))[0])
    res.render('index.ejs',{ 
        data : data,
        tab : 'Teams',
        title : 'form',
        page : 'New User',
        required : 'False',
        table: req.body.table
    })
})
router.post('/add', async (req,res)=>{
    // var connection = functions.getAccess()
    var data = await connection.query('SELECT * FROM [' + req.body.table + '] as u where u.email = ' + JSON.stringify(req.body.email))
    if(data.length === 1){
        // Update user data based on email address
        await connection.execute('Update ' + req.body.table + ' Set nickname = ' + JSON.stringify(req.body.nickname) + ' Where email = ' + JSON.stringify(req.body.email))
        
        // res.end('User Updated!')

    }else {
        // Add New User
        await connection.execute('INSERT INTO users (' + Object.keys(req.body) + ') VALUES (' + JSON.stringify(Object.values(req.body)).replace(/[\[\]']+/g,'') + ')')
        // res.end('User Added')
    } 
    // redirect as 307 to use post
    res.redirect('/teams')
})

module.exports = router

