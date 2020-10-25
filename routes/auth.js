const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const express = require('express')
const router = express.Router()




// router.get('/login', function (req, res) {
//     res.render('login')
// })

router.route('/login')
 .get(function(req,res){
    res.render('login', { title: 'Register a new  account' })

 })
 .post(passport.authenticate('local',{
     'successRedirect':'/',
     'failureRedirect':'login'
 }))

//  router.post('/authUser', passport.authenticate('local-login', {
//     'successRedirect': '/',
//     'failureRedirect': '/login',
    
// }));
router.route('/register')
    .get(function (req, res) {
        res.render('register', { title: 'Register a new  account' })
    })
    .post(function (req, res) {

        req.checkBody('name', 'Empty name').notEmpty();
        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('password', 'Empty password').notEmpty();
        req.checkBody('password2', 'password do not match').equals(req.body.password)

        var errors = req.validationErrors()
        if (errors) {
            res.render('register', {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors

            });
        } else {
            var user = new User()
            user.name = req.body.name;
            user.email = req.body.email;
            // user.password = user.encryptPassword(req.body.password)
            user.setPassword(req.body.password)

            user.save(function (err) {
                if (err) {
                    res.render('register', {
                        errorMessages: err
                    })
                } else {
                    console.log(user)
                    res.redirect('/login')

                }
            })
        }
    })

    router.get('/logout', function(req,res){
        req.logOut()
        res.redirect('/')
    })

    router.get('/auth/facebook', passport.authenticate('facebook',{
        scope:'email'
    }))
    router.get('/auth/facebook/callback', passport.authenticate('facebook',{
        successRedirect:'/',
        failureRedirect:'/'
    }))

    module.exports = router