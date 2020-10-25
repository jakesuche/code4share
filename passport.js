const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const facebookStrategy = require('passport-facebook').Strategy

passport.serializeUser(function(user,done){
    done(null,user._id)
});

passport.deserializeUser(function(id,done){
    User.findOne({_id:id}, function(err,user){
        done(err,user)
    })
});

passport.use(new LocalStrategy({
    usernameField:'email'
},
function(username,password,done){
    User.findOne({email:username}, function(err,user){
        if(err) return done(err);
        if(!user){
            return done(null,false, {
                message: 'Incorrect username or password'
            })
            
        }
        if(!user.validPassword(password)){
            return done(null, false, {
                message:"Incorrect username or password"
            })
        }
        return done(null,user)
        
    })
}

))


// passport.use(new facebookStrategy({

// },
// function({})))

passport.use(new facebookStrategy({
    clientID: 677002629595937,
    clientSecret: "eb4b3d2c97310f2a061ee0124386b15c",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']

  },
    function(token, refreshToken,profile,done){
        User.findOne({'facebookid':profile.id}, function(err,user){
            if(err) return done(err);

            if(user){
                return done(null, user)
            }else{
                User.findOne({email: profile.emails[0].value}, function(err,user){
                    if(user){
                        user.facebookid = profile.id
                        return user.save(function (err) {
                            if(err) return done(null,false,{message:"can't save user info"});
                            return done(null,user)
                            
                        })

                    }
                    var user = new User();
                    user.name = profile.displayName;
                    user.email = profile.emails[0].value;
                    user.facebookid = profile.id
                    user.save(function(err){
                        if(err) return done(null, false, {message:"can't save user info"});
                        return done(null,user)
                    });
                })
            }
        });
    }
  ));

// let passport = require('passport');
// let localStrategy = require('passport-local').Strategy;
// let userModel =  require('../models/users')



//serialize saves the use information into the session was it has been authenticated;

// module.exports = function(){
//     passport.serializeUser(function(user, done){
//         done(null, user.id);
//     });

//     passport.deserializeUser(function(id, done){
//         userModel.findById(id, function(err, user){
//             done(null, user)
//         })
//     })

//     passport.use('local-login' , new localStrategy({
//         usernameField:'email',
//         passwordField:'password',
//         passReqToCallback:true
//     },function(req, email,password, done){
//         User.findOne({'email':email}, function(err,user){
//             if(err){
//                 throw err;
//             }if(!user){
//                 req.flash('loginError', 'Sorry, we cant find an account with this email address. please try again or ');
//                 console.log('Got in the first ')
//                 return done(null, false)
                
//             }
//             if(!user.checkPassword(req.body.password)){
//                 req.flash('loginError2', 'username or password incorrect');
//                 console.log('Got in the second ')
//                 return done(null, false)
//             }else{
//                 console.log('Was successful ')
//                 return done(null, user)
//             }
            
//         })
//     }))
    
// }