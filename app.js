import 'dotenv/config.js'
import express from 'express';
import mongoose from 'mongoose';
import uniqueRandom from 'unique-random';
const random = uniqueRandom(10, 9999);

// const fs = require('fs');
// const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// mongoDB config
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true, useUnifiedTopology: true,
//     'useCreateIndex': true,
//     'useFindAndModify': false
// })
//     .then(() => {
//         console.log('Connected to mongoDB.');
//     })
//     .catch(err => console.error(err.message));

try {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    console.log('Server connected to MongoDb!');
} catch (err) {
    console.error(err);
}

import Employee from './model.js';

// Image uploading

// import multer from 'multer';

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

// var upload = multer({ storage: storage });

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// api endpoints
app.route('/')
    .get((req, res) => {
        Employee.find({}, (err, employee) => {
            if (err) {
                return res.json({
                    success: false,
                    message: err.message,
                });
            }

            return res.json({
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
                return res.json({
                    success: false,
                    message: err.message,
                });
            }

            return res.json({
                success: true,
                message: "Successfully added a new employee.",
            });

        });
    });

app.route("/:empId")
    .get((req, res) => {

        Employee.findOne({ employeeId: req.params.empId }, (err, employee) => {

            if (employee) {
                return res.json({
                    success: true,
                    message: "Found employee with id: " + employee.employeeId,
                    "data": { employee }
                });
            }
            return res.json({
                success: false,
                message: "No employees with employee id: " + req.params.empId + " found.",
            });
        });
    })
    .patch((req, res) => {

        Employee.updateOne({ employeeId: req.params.empId },
            { $set: req.body },
            (err) => {
                if (!err) {
                    return res.json({
                        success: true,
                        message: "Successfully updated!",
                    });
                }

                return res.json({
                    success: false,
                    message: err.message,
                });
            })
    })
    .delete((req, res) => {
        Employee.deleteOne({ employeeId: req.params.empId },
            (err) => {
                if (!err) {
                    return res.json({
                        success: true,
                        message: "Successfully deleted!",
                    });
                }

                return res.json({
                    success: false,
                    message: err.message,
                });
            })
    });

app.listen(PORT, err => {
    if (err)
        throw err;
    console.log('Server listening on port', PORT)
});