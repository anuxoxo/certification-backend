require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

try {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    console.log('Server connected to MongoDB.');
} catch (err) {
    console.error(err);
}

const Employee = require('./models/employee.js');

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/', require('./routes/employeeRoute'));

app.listen(PORT, err => {
    if (err)
        throw err;
    console.log('Server listening on port', PORT)
});