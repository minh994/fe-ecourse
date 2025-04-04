const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            text: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }],
        explanation: String,
        points: {
            type: Number,
            default: 1
        }
    }],
    passingScore: {
        type: Number,
        required: true,
        min: 0
    },
    attempts: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: Number,
        answers: [{
            questionId: mongoose.Schema.Types.ObjectId,
            selectedOptions: [Number],
            isCorrect: Boolean
        }],
        startedAt: Date,
        completedAt: Date
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    }
}, {
    timestamps: true
});

// Calculate total points
examSchema.methods.calculateTotalPoints = function() {
    return this.questions.reduce((total, question) => total + question.points, 0);
};

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam; 