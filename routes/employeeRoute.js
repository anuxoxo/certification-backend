const express = require('express');
const app = express();
const mongoose = require('mongoose');
const uniqueRandom = require('../uniqueRandom');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');

const Employee = mongoose.model('Employee');
const random = uniqueRandom(10, 10000);

// express-session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

const User = mongoose.model('User');

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Image uploading
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

// Login admin
app.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {

        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, (err) => {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate("local")(req, res, () => {

                    // res.redirect('/employees');
                    res.json({
                        success: true,
                        message: "User logged in successfully!"
                    });
                })
            }
        })
    });

// Logout
app.get('/logout', (req, res) => {
    req.logOut();
    res.json({
        success: true,
        message: "User logged out successfully!"
    })
})

// Read/Create employees
app.route('/employees')
    .get((req, res) => {

        if (req.isAuthenticated()) {

            Employee.find({}, (err, employee) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: err.message,
                    });
                }

                return res.send({
                    success: true,
                    message: "Employee list found.",
                    "data": { employee }

                });

            })
        } else {
            res.json({ success: false, message: "Please log in." })
        }
    })
    .post(upload.single('image'), (req, res) => {
        if (req.isAuthenticated()) {

            const {
                employeeName,
                yog,
                dept,
                yoj,
                project
            } = req.body;

            const year = yoj.toString().substr(-2);
            const employeeId = `${year}V${random()}`;

            // check if uploaded file is img
            if (req.file) {

                const mimetype = req.file.mimetype;

                if (mimetype.split('/')[0] === 'image') {
                    profileImg = {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                        contentType: 'image/*'
                    }
                }

            }

            // ------- How to access img in Frontend -------

            // <img src="data:image/{image.img.contentType};base64,
            // 			{image.img.data.toString('base64')}">

            const newEmployee = new Employee({
                employeeId, employeeName, yog, dept, yoj, profileImg, project
            });

            newEmployee.save((err) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: err.message,
                    });
                }

                return res.send({
                    success: true,
                    message: "Successfully added a new employee.",
                });

            });
        } else {
            res.json({ success: false, message: "Please log in." })
        }
    });


// CRUD - a particular employee
app.route("/employees/:empId")
    .get((req, res) => {

        Employee.findOne({ employeeId: req.params.empId }, (err, employee) => {

            if (employee) {
                return res.send({
                    success: true,
                    message: "Found employee with id: " + employee.employeeId,
                    "data": { employee }
                });
            }
            return res.send({
                success: false,
                message: "No employees with employee id " + req.params.empId + " found.",
            });
        });
    })


    .patch((req, res) => {

        if (req.isAuthenticated()) {

            // update employeeId if yoj is changed
            if (req.body.hasOwnProperty("yoj")) {

                const year = req.body.yoj.toString().substr(-2);
                const employeeId = `${year}V${random()}`;
                req.body.employeeId = employeeId;
            }

            // update profile img
            if (req.file) {

                const mimetype = req.file.mimetype;

                if (mimetype.split('/')[0] === 'image') {
                    profileImg = {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                        contentType: 'image/*'
                    }
                    req.body.profileImg = profileImg;
                }

            }

            Employee.updateOne({ employeeId: req.params.empId },
                { $set: req.body },
                (err) => {
                    if (!err) {
                        return res.send({
                            success: true,
                            message: "Successfully updated!",
                        });
                    }

                    return res.send({
                        success: false,
                        message: err.message,
                    });
                })
        } else {
            res.json({ success: false, message: "Please log in." })
        }

    })
    .delete((req, res) => {
        if (req.isAuthenticated()) {

            Employee.deleteOne({ employeeId: req.params.empId },
                (err) => {
                    if (!err) {
                        return res.send({
                            success: true,
                            message: "Successfully deleted!",
                        });
                    }

                    return res.send({
                        success: false,
                        message: err.message,
                    });
                })
        } else {
            res.json({ success: false, message: "Please log in." })
        }

    });


module.exports = app;