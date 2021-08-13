require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ejs = require('ejs');



require('./models/employeeModel');
require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use(require('./routes/employeeRoute'));
// app.use(require('./routes/auth'));

// MongoDB config
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useCreateIndex: true
    })
    .then(() => { console.log("Server connected to MongoDB.") })
    .catch(err => console.error(err));

app.get('/', (req, res) => {
    req.body.copy = "copy me";
    console.log(req.body);
})

app.listen(PORT, err => {
    if (err)
        console.log(err);
    console.log('Server listening on port', PORT)
});