const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    employeeName: {
        type: String,
        required: true,
    },
    yog: {
        type: Number,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    yoj: {
        type: Number,
        required: true
    },
    profileImg:
    {
        type: {
            data: Buffer,
            contentType: String
        },
        default: {
            data: fs.readFileSync(path.join(__dirname, "../uploads/no-photo.png")),
            contentType: 'image/*'
        }
    },
    project: [
        {
            projectName: String,
            projectLink: String,
            role: String
        }
    ]
});

mongoose.model('Employee', employeeSchema);
