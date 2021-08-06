import mongoose from 'mongoose';

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
        data: Buffer,
        contentType: String
    },
    project: [
        {
            projectName: String,
            projectLink: String,
            role: String
        }
    ]
});

export default new mongoose.model('Employee', employeeSchema);
