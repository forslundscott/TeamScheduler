const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport( {
    service: 'PH1P110MB1585.NAMP110.PROD.OUTLOOK.COM',
    auth: {
        user: 'PWAATransformation@prattwhitney.com'
        // pass: ''
    }
})
const options = {
    from: 'PWAATransformation@prattwhitney.com', // sender address
    to: "scott.forslund@prattwhitney.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    // html: "<b>Hello world?</b>", // html body
  };
  transporter.sendMail(options, function(err,info){
    if(err){
        console.log(err);
        return;
    }
    console.log('Sent:' + info.response)
  })