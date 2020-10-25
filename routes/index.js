var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer')
var config = require('../config')
var transporter = nodemailer.createTransport(config.mailer)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'code4Share - a platform for sharing code' });
});

router.get('/about', function(req,res){
   res.render('about',{title:'code for share'})
})

router.route('/contact')
  .get(function(req,res,next){
    res.render('contact',{title:'code4Share - a platform for sharing code'})
  })
  .post(function(req,res,next){
    req.checkBody('name', 'Empty name').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('message', 'Empty message').notEmpty();

    var errors = req.validationErrors()

    if(errors){
      res.render('contact',{
        title:'code4Share - a platform for sharing code',
        name:req.body.name,
        email:req.body.email,
        message:req.body.message,
        errorMessage:errors
      });

    }else{
      var mailOptions = {
        from: 'Code4Share <noreply@code4share.com>' ,
        to:'uchechidi9@gmail.com',
        subject:'you got a new message from uche 😲 ',
        text: req.body.message,
        
      }

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          return console.log(error)

        }
        console.log(info)
        res.render('thanku', {title:'code4Share - a platform for sharing code'})
      })
      
    }
   
  });

//   router.get('/register',function(req, res){
//     res.render('register', {title: 'Register a new  account'})
//   })
//   router.get('/login',function(req,res){
//     res.render('login')
//   })
  router.get('/task', function(req,res){
    res.render('task')
  })

module.exports = router;
