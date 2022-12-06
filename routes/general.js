const bodyParser = require("body-parser")
const express = require("express")
const router = express.Router()
const fs = require('fs')
router.use(express.urlencoded({ extended: true }))
// router.use(bodyParser.urlencoded({ extended: true }));
router.get('/',(req,res)=>{
    
})
function postType(xType,reqdata){
    fs.readFile('./public/FeedbackData.json', 'utf-8', function(err, data) {
        if (err) throw err
    
        var arrayOfObjects = JSON.parse(data)
        reqdata.Time = Intl.DateTimeFormat('en-us', { dateStyle: 'short', timeStyle: 'long' }).format(Date.now())
        if (reqdata.type == 'Andon'){
            arrayOfObjects.Andon.push(reqdata)
        }else if(reqdata.type == 'Comment'){
            arrayOfObjects.Comments.push(reqdata)
        }
        fs.writeFile('./public/FeedbackData.json', JSON.stringify(arrayOfObjects,null,1), 'utf-8', function(err) {
            if (err) throw err
            console.log('Done!')
        })
    })
    
}
router.post('/Andon',(req,res)=>{
    req.body.type = 'Andon'
    postType('Andon',req.body)
    console.log(JSON.stringify(req.body))
    res.redirect('back')
})
router.post('/Comments',(req,res)=>{
    req.body.type = 'Comment'
    postType('Comments',req.body)
    console.log(JSON.stringify(req.body))    
    res.redirect('back')
})
router.post('/test',(req,res)=>{
    const bodyParser = require('body-parser')
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());
    console.log(req.body)    
})
router.get('/submit',(req,res)=>{
    console.log('gettest')
})
module.exports = router