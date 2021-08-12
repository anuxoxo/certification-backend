const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uniqueRandom = require('../uniqueRandom');
const fs = require('fs');
const path = require('path');

const Employee = mongoose.model('Employee');
const random = uniqueRandom(10, 9999);

// Image uploading

// const multer = require('multer');

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

// var upload = multer({ storage: storage });

router.route('/')
    .get((req, res) => {
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
    })
    .post((req, res) => {

        const {
            employeeName,
            yog,
            dept,
            yoj,
            project
        } = req.body;

        const year = yoj.toString().substr(-2);
        const employeeId = `${year}V${random()}`;

        // const profileImg = {
        //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        //     contentType: 'image/png'
        // }

        const newEmployee = new Employee({
            employeeId: employeeId,
            employeeName: employeeName,
            yog: yog,
            dept: dept,
            yoj: yoj,
            // profileImg: profileImg,
            project: project
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
    });

router.route("/:empId")
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
    })
    .delete((req, res) => {
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
    });

module.exports = router;