const express = require("express")
const app = express()
const port = 3000
const genRouter = require('./routes/general')
app.use('/general',genRouter)
app.use(express.urlencoded({ extended: true }))
let options = {
    
}

function getAccess(){
    var ADODB = require('node-adodb');
    ADODB.debug = true;

    // Connect to the MS Access DB
    var connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\x002970\\Documents\\TeamMateDB.accdb;Persist Security Info=False;');
    return connection
    // Query the DB
    // const testvar = JSON.stringify(await connection.query('SELECT * FROM [game_data];'))
    // console.log(testvar)
        // .then(data => {
        //     console.log(data);
        // })
        
}

var data = require('./public/events.json')
var data = require('./public/teams.json')
// app.locals.events = events
app.use(express.static('public',options))
app.set('view-engine','ejs')
// var data = require('./public/events.json')
app.get('/', (req,res)=>{
    // getSQL(req,res)
    
    res.render('index.ejs',{ data : data,
        tab : 'Events',
        title : 'Events',
        page : 'Events'
    })
})
app.get('/events', async (req,res)=>{
    // getSQL(req,res)
    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [game_data]')
    // var data = require('./public/events.json')
    res.render('index.ejs',{ data : data,
        tab : 'Events',
        title : 'Events',
        page : 'Events'
    })
    
})
app.get('/teams', async (req,res)=>{
    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [teams]')
    // var data = require('./public/teams.json')
    res.render('index.ejs',{ data : data,
        tab : 'Teams',
        title : 'Teams',
        page : 'Teams'
    })
})
app.get('/manage', async (req,res)=>{
    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [organizations]')
    // var data = require('./public/teams.json')
    res.render('index.ejs',{ data : data,
        tab : 'Manage',
        title : 'Manage',
        page : 'Manage'
    })
})
app.post('/useradd', async (req,res)=>{
    var connection = getAccess()
    // console.log(req.body.game_id)
    var data = await connection.query('SELECT * FROM [users] as u where u.email = ' + JSON.stringify(req.body.email))
    if(data.length === 1){
        
        await connection.execute('Update users Set nickname = ' + JSON.stringify(req.body.nickname) + ' Where email = ' + JSON.stringify(req.body.email))
        res.end('User Updated!')
    }else {
        console.log(JSON.stringify(req.body))
        console.log(JSON.stringify(req.body.email))
        res.end('User Added')
    }
    // console.log(data.length)
    // window.alert()
    
    // res.render('index.ejs',{ data : data,
    //     tab : 'Game',
    //     title : 'Game',
    //     page : 'Game: ' + req.body.game_id + ' ' + req.body.home + ' vs ' + req.body.away
    // })
})
app.post('/game', async (req,res)=>{
    var connection = getAccess()
    console.log(req.body.game_id)
    var data = await connection.query('SELECT * FROM [rsvp_query] as rq where rq.game = ' + req.body.game_id)
    console.log(data)
    res.render('index.ejs',{ data : data,
        tab : 'Game',
        title : 'Game',
        page : 'Game: ' + req.body.game_id + ' ' + req.body.home + ' vs ' + req.body.away
    })
})
app.get('/chat', (req,res)=>{
    var data = require('./public/chat.json')
    res.render('index.ejs',{ data : data,
        tab : 'Chat',
        title : 'Chat',
        page : 'Chat'
    })
    
})
app.get('/leagues', async (req,res)=>{
    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [leagues]')
    
    // var data = require('./public/leagues.json')
    res.render('index.ejs',{ data : data,
        tab : 'Leagues',
        title : 'Leagues',
        page : 'Leagues'
    })
    
})
app.get('/team', (req,res)=>{
    var data = require('./public/players.json')
    res.render('index.ejs',{ data : data,
        tab : 'Team',
        title : 'Team',
        page : 'Team'
    })
})

app.post('/team', async (req,res)=>{
    var connection = getAccess()
    var data = await connection.query('SELECT * from user_role_team as urt left outer join users as u on urt.user=u.id')
    res.render('index.ejs',{ data : data,
        tab : req.body.tab,
        title : 'Team',
        id : req.body.id,
        page : req.body.name
    })
})
app.post('/organization', async (req,res)=>{

    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [leagues]')
    console.log(req.body.id)
    res.render('index.ejs',{ data : data,
        tab : req.body.tab,
        title : 'Organization',
        id : req.body.id,
        page : req.body.name
    })
})
app.post('/league', async (req,res)=>{
    // var data = require('./public/players.json')
    var connection = getAccess()
    var data = await connection.query('SELECT * from league_team as lt inner join teams as t on lt.team=t.id')
    res.render('index.ejs',{ data : data,
        tab : req.body.tab,
        title : 'League',
        id : req.body.id,
        page : req.body.name
    })
})
app.listen(port, function(err){
    if (err) console.log(err);
    // console.log("Server listening on PORT", port);
 })
 function getSQL(req,res){
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'PWUS\X002970',
        // password: '',
        server: 'AI978217', 
        // dialect: 'mssql',
        port: 1433,
        database: 'TeamMateDB' 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select top 1 * from Users', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            console.log(recordset)
            res.send(recordset);
            
        });
    });
}