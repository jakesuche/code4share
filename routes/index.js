var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req,res){
   res.render('about',{title:'code for share'})
})

router.route('/contact')
  .get(function(req,res,next){
    res.render('contact',{title:'code4Share - a platform for sharing code'})
  })
  .post(function(req,res,next){
    res.checkBody('name', 'Empty name').notEmpty();
    res.checkBody('email', 'Invalid email').isEmail();
    res.checkBody('massage', 'Empty message').notEmpty();

    var errors = req.validationErrors()

    if(error){
      res.render('contact',{
        title:'code4Share - a platform for sharing code',
        name:req.body.name,
        email:req.body.email,
        message:req.body.message,
        errorMessage:errors
      });

    }else{
      res.render('thanku', {title:'code4Share - a platform for sharing code'})
    }
   
  });

module.exports = router;
