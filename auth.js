const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GOOGLE_CLIENT_ID = '557167487576-hl5t6v6f4genuep28dbs1phe4p24jfrp.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const con = require('./db');

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:80/google/callback",
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {

        process.nextTick(function() {
            con.query("select * from user1 where user_email = ?;", [profile.emails[0].value], (err, user) => {
                if (err) {
                    return done(err);
                } else if (user && user != 0) {
                    return done(null, user);
                } else {
                    con.query('insert into user1 set user_name = ?, user_email = ?, created_date = now()', [profile.displayName, profile.emails[0].value], (err, rows) => {
                        if (err) {
                            console.log(err);
                        } else {
                            con.query("select * from user1 where user_email = ?;", [profile.emails[0].value], (err, user) => {
                                if (err) {
                                    return done(err);
                                } else if (user && user != 0) {
                                    return done(null, user);
                                }
                            });
                        }
                    })
                }
            });
        });

    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
})

passport.deserializeUser(function(user, done) {
    done(null, user);
})