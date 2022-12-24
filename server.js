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


var data = require('./public/teams.json')
app.use(express.static('public',options))
app.set('view-engine','ejs')
app.get('/', (req,res)=>{
    // getSQL(req,res)
    
    res.render('index.ejs',{ data : data,
        tab : 'Games',
        title : 'Games',
        page : 'Games'
    })
})
app.get('/games', async (req,res)=>{
    // getSQL(req,res)
    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [game_data]')

    res.render('index.ejs',{ data : data,
        tab : 'Games',
        title : 'List',
        page : 'Games',
        listTitle : 'game_name',
        listAction : 'game',
        listChildId : 'game_id'
    })
    
})
app.get('/teams', async (req,res)=>{
    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [teams]')
    // var data = require('./public/teams.json')
    res.render('index.ejs',{ data : data,
        tab : 'Teams',
        title : 'List',
        page : 'Teams',
        listTitle : 'team_name',
        listAction : 'team',
        listChildId : 'id'
    })
})
app.get('/organizations', async (req,res)=>{
    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [organizations]')
    // var data = require('./public/teams.json')
    res.render('index.ejs',{ data : data,
        tab : 'Organizations',
        title : 'List',
        page : 'Organizations',
        listTitle : 'organization_name',
        listAction : 'organization',
        listChildId : 'id'
    })
})
app.get('/new_user', async (req,res)=>{
    // var connection = getAccess()
    // var data = await connection.query('SELECT * FROM [organizations]')
    // var data = require('./public/teams.json')
    res.render('index.ejs',{ data : data,
        tab : 'Teams',
        title : 'new_user',
        page : 'New User'
    })
})
app.post('/useradd', async (req,res)=>{
    var connection = getAccess()
    
    var data = await connection.query('SELECT * FROM [users] as u where u.email = ' + JSON.stringify(req.body.email))
    if(data.length === 1){
        // Update user data based on email address
        await connection.execute('Update users Set nickname = ' + JSON.stringify(req.body.nickname) + ' Where email = ' + JSON.stringify(req.body.email))
        res.end('User Updated!')
    }else {
        // Add New User
        var titlestr = ''
        var tempdata = JSON.stringify(req.body)
        
        await connection.execute('INSERT INTO users (' + Object.keys(req.body) + ') VALUES (' + JSON.stringify(Object.values(req.body)).replace(/[\[\]']+/g,'') + ')')
        
        res.end('User Added')
    }
    
})
app.post('/game', async (req,res)=>{
    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [rsvp_query]')
    console.log(req.body)
    res.render('index.ejs',{ data : data,
        tab : req.body.tab,
        title : 'List',
        id : req.body.id,
        page : req.body.name,
        listTitle : 'first_name',
        listAction : 'user',
        listId : 'game',
        listChildId : 'user'
    })
})
app.get('/leagues', async (req,res)=>{
    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [leagues]')
    
    // var data = require('./public/leagues.json')
    res.render('index.ejs',{ data : data,
        tab : 'Leagues',
        title : 'List',
        page : 'Leagues',
        listTitle : 'league_name',
        listAction : 'league',
        listChildId : 'id'
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
    var data = await connection.query('SELECT urt.*, email, first_name, last_name, nickname, dob, gender from user_role_team as urt left outer join users as u on urt.user=u.id')
    res.render('index.ejs',{ data : data,
        tab : req.body.tab,
        title : 'List',
        id : req.body.id,
        page : req.body.name,
        listTitle : 'last_name',
        listAction : 'user',
        listId : 'team',
        listChildId : 'user'
    })
})
app.post('/organization', async (req,res)=>{

    var connection = getAccess()
    var data = await connection.query('SELECT * FROM [leagues]')
    
    res.render('index.ejs',{ data : data,
        tab : req.body.tab,
        title : 'List',
        id : req.body.id,
        page : req.body.name,
        listTitle : 'league_name',
        listAction : 'league',
        listId : 'organization',
        listChildId : 'id'
    })
})
app.post('/league', async (req,res)=>{
    var connection = getAccess()
    var data = await connection.query('SELECT lt.id as id, team, team_name, league, [session] from league_team as lt inner join teams as t on lt.team=t.id')
    
    res.render('index.ejs',{ data : data,
        tab : req.body.tab,
        title : 'List',
        id : req.body.id,
        page : req.body.name,
        listTitle : 'team_name',
        listAction : 'team',
        listId : 'league',
        listChildId : 'team'
    })
})
app.listen(port, function(err){
    // if (err) console.log(err);
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
    
        // if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select top 1 * from Users', function (err, recordset) {
            
            // if (err) console.log(err)

            // send records as a response
            console.log(recordset)
            res.send(recordset);
            
        });
    });
}