import 'dotenv/config.js'
import express from 'express';
import mongoose from 'mongoose';
import uniqueRandom from 'unique-random';
const random = uniqueRandom(10, 9999);

// const fs = require('fs');
// const path = require('path');

const app = express();

// mongoDB config
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, 'useCreateIndex': true })
    .then(() => {
        console.log('Connected to mongoDB.');
    })
    .catch(err => console.error(err.message));

import Employee from './model.js';

import multer from 'multer';

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// api endpoints
app.route('/')
    .get((req, res) => {
        Employee.find((err, employee) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(employee);
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

        const profileImg = {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }

        const newEmployee = new Employee({
            employeeId: employeeId,
            employeeName: employeeName,
            yog: yog,
            dept: dept,
            yoj: yoj,
            profileImg: profileImg,
            project: project
        });

        newEmployee.save((err) => {
            if (err) {
                res.status(500).send(err.message);
            }
            else {
                res.status(200).send("Successfully added a new employee.");
            }
        });
    });

app.route("/:empId")
    .get((req, res) => {
        Employee.findOne({ employeeId: req.params.empId }, (err, Employee) => {
            if (Employee) {
                res.status(200).send(Employee);
            }
            else {
                res.send("No matching Employees found.");
            }
        });
    })
    .patch((req, res) => {
        Employee.updateOne({ employeeId: req.params.empId },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.status(200).send("Successfully updated!");
                }
                else {
                    res.send(err.message);
                }
            })
    })
    .delete((req, res) => {
        Employee.deleteOne({ employeeId: req.params.empId },
            (err) => {
                if (!err) {
                    res.status(200).send("Successfully deleted!");
                } else {
                    res.status(500).send(err.message);
                }
            })
    });

app.listen(process.env.PORT, err => {
    if (err)
        throw err;
    console.log('Server listening on port', process.env.port)
});