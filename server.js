const express = require("express")
const functions = require('./helpers/functions')
const app = express()
const port = 3000
const forms = require('./routes/forms')

let options = {}

app.use('/forms',forms)
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public',options))
app.set('view-engine','ejs')

async function pageResponse(req,res,next){
    var connection = functions.getAccess()
    if(req.url == '/'){
        req.url = '/games'
    }
    var tempObj = {
        title : 'List',
        listChildId : 'id'
    }
    switch(req.route.stack[0].method){
        case 'get':
            tempObj.tab = functions.titleCase(req.url.replace(/\//g, ''))
            tempObj.page = tempObj.tab
            break;
        default:
            tempObj.tab = req.body.tab
            tempObj.page = req.body.name,
            tempObj.id = req.body.id
    }
    switch(req.url){
        case '/teams':
            tempObj.listTitle = 'team_name'
            tempObj.listAction = 'team'
            tempObj.data = await connection.query('SELECT * FROM [teams]')
            break;
        case '/organizations':
            tempObj.listTitle = 'organization_name',
            tempObj.listAction = 'organization'
            tempObj.data = await connection.query('SELECT * FROM [organizations]')
            break;
        case '/leagues' :
            tempObj.listTitle = 'league_name',
            tempObj.listAction = 'league'
            tempObj.data = await connection.query('SELECT * FROM [leagues]')
            break;
        case '/games' :
            tempObj.listTitle = 'game_name',
            tempObj.listAction = 'game'
            tempObj.data = await connection.query('SELECT * FROM [game_data]')
            break;
        case '/game' :
            tempObj.listTitle = 'first_name',
            tempObj.listAction = 'user',
            tempObj.listId = 'game',
            tempObj.listChildId = 'user'
            tempObj.data = await connection.query('SELECT * FROM [rsvp_query]')
            break;
        case '/team' :
            tempObj.listTitle = 'first_name',
            tempObj.listAction = 'user',
            tempObj.listId = 'team',
            tempObj.listChildId = 'user'
            tempObj.data = await connection.query('SELECT urt.*, email, first_name, last_name, nickname, dob, gender from user_role_team as urt left outer join users as u on urt.user=u.id')
            break;
        case '/organization' :
            tempObj.listTitle = 'league_name',
            tempObj.listAction = 'league',
            tempObj.listId = 'organization'
            tempObj.data = await connection.query('SELECT * FROM [leagues]')
            break;
        case '/league' :
            tempObj.listTitle = 'team_name',
            tempObj.listAction = 'team',
            tempObj.listId = 'league',
            tempObj.listChildId = 'team'
            tempObj.data = await connection.query('SELECT lt.id as id, team, team_name, league, [session] from league_team as lt inner join teams as t on lt.team=t.id')
            break;        
    }
    res.render('index.ejs',tempObj)
}
app.get(['/games','/','/teams','/organizations','/leagues'], async (req,res)=>{
    pageResponse(req,res)    
})
app.post(['/game','/team','/organization','/league'], async (req,res)=>{
    pageResponse(req,res)
})
app.get('/new_user', async (req,res)=>{
    res.render('index.ejs',{ 
        // data : data,
        tab : 'Teams',
        title : 'new_user',
        page : 'New User'
    })
})
async function formResponse(req,res,next){
    var connection = functions.getAccess()
    var tempObj = {
        title : 'List',
        listChildId : 'id'
    }
    switch(req.route.stack[0].method){
        case 'get':
            tempObj.tab = functions.titleCase(req.url.replace(/\//g, ''))
            tempObj.page = tempObj.tab
            break;
        default:
            tempObj.tab = req.body.tab
            tempObj.page = req.body.name,
            tempObj.id = req.body.id
    }
    switch(req.url){
        case '/teams':
            tempObj.listTitle = 'team_name'
            tempObj.listAction = 'team'
            tempObj.data = await connection.query('SELECT * FROM [teams]')
            break;
        case '/organizations':
            tempObj.listTitle = 'organization_name',
            tempObj.listAction = 'organization'
            tempObj.data = await connection.query('SELECT * FROM [organizations]')
            break;
        case '/leagues' :
            tempObj.listTitle = 'league_name',
            tempObj.listAction = 'league'
            tempObj.data = await connection.query('SELECT * FROM [leagues]')
            break;
        case '/games' :
            tempObj.listTitle = 'game_name',
            tempObj.listAction = 'game'
            tempObj.data = await connection.query('SELECT * FROM [game_data]')
            break;
        case '/game' :
            tempObj.listTitle = 'first_name',
            tempObj.listAction = 'user',
            tempObj.listId = 'game',
            tempObj.listChildId = 'user'
            tempObj.data = await connection.query('SELECT * FROM [rsvp_query]')
            break;
        case '/team' :
            tempObj.listTitle = 'first_name',
            tempObj.listAction = 'user',
            tempObj.listId = 'team',
            tempObj.listChildId = 'user'
            tempObj.data = await connection.query('SELECT urt.*, email, first_name, last_name, nickname, dob, gender from user_role_team as urt left outer join users as u on urt.user=u.id')
            break;
        case '/organization' :
            tempObj.listTitle = 'league_name',
            tempObj.listAction = 'league',
            tempObj.listId = 'organization'
            tempObj.data = await connection.query('SELECT * FROM [leagues]')
            break;
        case '/league' :
            tempObj.listTitle = 'team_name',
            tempObj.listAction = 'team',
            tempObj.listId = 'league',
            tempObj.listChildId = 'team'
            tempObj.data = await connection.query('SELECT lt.id as id, team, team_name, league, [session] from league_team as lt inner join teams as t on lt.team=t.id')
            break;        
    }
    res.render('index.ejs',tempObj)
}
app.get('/form', async (req,res)=>{
    var connection = functions.getAccess()
    var data = Object.keys((await connection.query('SELECT TOP 1 * FROM [users]'))[0])

    
    res.render('index.ejs',{ 
        data : data,
        tab : 'Teams',
        title : 'form',
        page : 'New User'
    })
})
app.post('/useradd', async (req,res)=>{
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
app.listen(port, function(err){
    // if (err) console.log(err);
 })