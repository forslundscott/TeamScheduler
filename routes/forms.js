const express = require("express")
const functions = require('../helpers/functions')
const router = express.Router()
let options = {}
// express().use(express.urlencoded({ extended: true }))
express().use(express.static('public',options))
// express().set('view-engine','ejs')



router.get('/new_user', async (req,res)=>{
    res.render('index.ejs',{ 
        // data : data,
        tab : 'Teams',
        title : 'new_user',
        page : 'New User'
    })
})
router.get('/form', async (req,res)=>{
    var connection = functions.getAccess()
    var data = Object.keys((await connection.query('SELECT TOP 1 * FROM [users]'))[0])
    // console.log(data.length)
    
    res.render('index.ejs',{ 
        data : data,
        tab : 'Teams',
        title : 'form',
        page : 'New User'
    })
})
router.post('/useradd', async (req,res)=>{
    var connection = functions.getAccess()
    var data = await connection.query('SELECT * FROM [users] as u where u.email = ' + JSON.stringify(req.body.email))
    if(data.length === 1){
        // Update user data based on email address
        await connection.execute('Update users Set nickname = ' + JSON.stringify(req.body.nickname) + ' Where email = ' + JSON.stringify(req.body.email))
        res.end('User Updated!')
    }else {
        // Add New User
        await connection.execute('INSERT INTO users (' + Object.keys(req.body) + ') VALUES (' + JSON.stringify(Object.values(req.body)).replace(/[\[\]']+/g,'') + ')')
        res.end('User Added')
    } 
})

module.exports = router

