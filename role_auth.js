const express = require('express')
const path = require('path');
const session = require('express-session');
const bodyParser = require("body-parser");
const app = express()
app.use(session({ secret: 'cats' }));
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
const port = process.env.PORT || 80;
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
require('./auth');
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended:  true  }))
    ///edits

app.set('view engine', 'ejs');
app.use('/css', express.static(__dirname + '/public/stylesheets'));
app.use('/js', express.static(__dirname + '/public/javascripts'));
app.use('/images', express.static(__dirname + '/public/images'));

/*app.use(express.static('public'))*/

const userRouter = require('./routes/index')
app.use('/', userRouter)

const student = require('./routes/student')
app.use('/student', student)

const teacher = require('./routes/teacher')
app.use('/teacher', teacher)

const admin = require('./routes/admin')
app.use('/admin', admin)

const s3 = require('./s3')
app.use('/s3', s3)


function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
}
app.use(errorHandler);

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

function isAdmin(req, res, next) {
    if (req.user[0].user_id != null) {
        if (req.user[0].user_role == 'admin') {
            next();
        } else {
            res.sendStatus(401);
        }
    }
}

function isTeacher(req, res, next) {
    if (req.user[0].user_id != null) {
        if (req.user[0].user_role == 'teacher' || req.user[0].user_role == 'admin') {
            next();
        } else {
            res.sendStatus(401);
        }
    }
}

function isStudent(req, res, next) {
    if (req.user[0].user_id != null) {
        if (req.user[0].user_role == 'student' || req.user[0].user_role == 'admin') {
            next();
        } else {
            res.sendStatus(401);
        }
    }
}

const con = require('./db');
app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)
app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/dummy',
        failureRedirect: '/auth/failure',
    })
);
app.get('/auth/failure', (req, res) => {
    res.send('something went wrong');
});

app.get('/dummy', isLoggedIn, (req, res) => {
    con.query("select role from user1 where user_id = ?;", [req.body.user_id], function(err, user) {
        if (req.user[0].user_role == null) {
            res.redirect('register');
        } else {
            res.redirect(`/${req.user[0].user_role}`);
        }
    });
})

app.get('/home', (req, res) => {
    res.send('home');
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/details', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user[0].user_name}`);
})
app.get('/register', (req, res) => {
    con.query("select type_value from predefined where type=? AND type_value != 'admin';select type_value from predefined where type=?;select type_value from predefined where type=?;", ["role", "school name", "language"], function(error, results) {
        if (error) throw error;
        else {
            res.render('register', { data1: results[0], data2: results[1], data3: results[2] });
        }
    });
})
app.post('/register', (req, res) => {
    con.query(`UPDATE user1 SET user_role=?,school_name=?,preferred_language=? WHERE user_id=?`, [req.body.user_role, req.body.school_name, req.body.preferred_language, req.user[0].user_id], function(error, results) {
        if (error) throw error;
        req.user[0].user_role = req.body.user_role;
        req.user[0].school_name = req.body.school_name;
        req.user[0].preferred_language = req.body.preferred_language;
        res.redirect(`/${req.user[0].user_role}`);
    });
})


// //question routes
// //view question
// app.get('/question', (req, res) => {
//         res.render('question');
//     })
//     //create
// app.get('/question/new', (req, res) => {
//     res.render('question');
// })
// app.post('/question', (req, res) => {
//     console.log(req.body);
//     con.query(`insert into questions set creator_id=?,reference_tag_id=?,question = ?, option_1 = ?,option_2 = ?,option_3 = ?,option_4= ?,answer = ?,date=now(),approval=?,question_url=?,answer_url=?`, [req.body.user_id, req.body.reference_tag, req.body.question, req.body.option_1, req.body.option_2, req.body.option_3, req.body.option_4, req.body.answer, req.body.date, req.body.standard, req.body.approved, req.body.difficulty, req.body.question_url, req.body.answer_url, req.body.answered, req.body.reference_id], function(error, results) {
//         if (error) throw error;
//         return res.send({ error: false, data: results, message: 'New question has been created successfully.' });
//     });
// })

// //show
// app.get('/question/show', (req, res) => {
//     res.send('question');
// })

// app.get('/question/show/:question', (req, res) => {
//         con.query(`select * from  questions where question = ?`, [req.body.question], function(error, results, fields) {
//             if (error) throw error;
//             console.log(req)

//             return res.send(results);
//         });
//     })
//     // update

// app.put('/question/:question', (req, res) => {
//     con.query(`update questions set user_id=?,reference_tag=?,question = ?, option_1 = ?,option_2 = ?,option_3 = ?,option_4= ?,answer = ?,date=?,standard=?,approved=?,difficulty=?,question_url=?,answer_url=?,answered=?,reference_id=? where question =?`, [req.body.body.user_id, req.body.body.reference_tag, req.body.body.question, req.body.body.option_1, req.body.body.option_2, req.body.body.option_3, req.body.body.option_4, req.body.body.answer, req.body.body.date, req.body.body.standard, req.body.body.approved, req.body.body.difficulty, req.body.body.question_url, req.body.body.answer_url, req.body.body.answered, req.body.body.reference_id, req.body.params.question], function(error, results) {
//         if (error) throw error;
//         console.log(req)
//         return res.send({ error: false, data: results, message: 'Question has been updated successfully.' });
//     });
// })

// // delete
// app.delete('/question/delete/:question', (req, res) => {
//     con.query(`delete from questions where question=?`, [req.body.question], function(error, results, fields) {
//         console.log(req);
//         if (error) throw error;
//         return res.send({ error: false, data: results, message: 'Deleted successfully.' });
//     });
// })

// //student routes
// //view students
// app.get('/student', (req, res) => {
//         res.render('student');
//     })
//     //create
// app.get('/student/new', (req, res) => {
//     res.render('student');
// })
// app.post('/student', (req, res) => {
//         console.log(req.body);
//         con.query(`insert into user1 SET user_role=?,school_name=?,preferred_language=? WHERE user_id=?`, [parseInt(req.body.user_role), parseInt(req.body.school_name), parseInt(req.body.preferred_language), req.user.id], function(error, results) {
//             if (error) throw error;
//             return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
//         });
//     })
//     //show
// app.get('/student/show', (req, res) => {
//     res.render('student');
// })
// app.get('/student/show/:name', (req, res) => {
//         con.query(`select * from user1 WHERE user_name=?`, [req.params.name], function(error, results) {
//             if (error) throw error;
//             res.redirect('/');
//         });
//     })
//     // update
// app.put('/student/:name', (req, res) => {
//         con.query(`UPDATE user1 SET user_role=?,school_name=?,preferred_language=? WHERE user_id=?`, [parseInt(req.body.user_role), parseInt(req.body.school_name), parseInt(req.body.preferred_language), req.user.id], function(error, results) {
//             if (error) throw error;
//             res.redirect('/');
//         });
//     })
//     // delete
// app.delete('/student/:name', (req, res) => {
//     con.query(`delete from user1 where user_name=?`, [req.body.user_name], function(error, results) {
//         if (error) throw error;
//         res.redirect('/');
//     });
// })



// app.get('/predefined', (req, res) => {
//     res.render('predefined');
// })

// app.post('/predefined', async(req, res) => {
//     console.log(req.body);
//     await con.query(`insert into predefined set predefined_id = ?, type = ?,type_value = ?`, [, req.body.predefined_type, req.body.predefined_value], function(error, results) {
//         if (error) throw error;
//         return res.redirect('predefined');
//     });
// })

// app.get('/predefined/:id', (req, res) => {
//     res.send(req.params.id);
// })
// app.delete('/predefined/:id', async(req, res) => {
//     await con.query(`delete from predefined where predefined_id= ?`, [req.params.id], function(error, results) {
//         if (error) throw error;
//         return res.send({ error: false, data: results, message: 'Predefined has been deleted successfully.'  });
//     });
// })

// app.get('/predefined/:id', (req, res) => {
//     res.render('predefined');
// })
// app.put('/predefined/:id', async(req, res) => {
//     console.log(req.params.id);
//     await con.query(`UPDATE predefined set type = ?,type_value = ? where predefined_id= ?`, [req.body.type, req.body.type_value, req.params.id], function(error, results) {
//         if (error) throw error;
//         return res.send({ error: false, data: results, message: 'predefined data has been updated successfully.'  });
//     });
// })

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
module.exports = con;
