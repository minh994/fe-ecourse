const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { auth, checkRole } = require('../middleware/auth');

// Get all exams
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate('course', 'title')
            .populate('teacher', 'name email')
            .sort('-createdAt');
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get exam by ID
router.get('/:id', async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate('course', 'title')
            .populate('teacher', 'name email')
            .populate('attempts.student', 'name email');
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create exam
router.post('/', auth, checkRole(['teacher', 'admin']), async (req, res) => {
    try {
        const exam = new Exam({
            ...req.body,
            teacher: req.user._id
        });

        await exam.save();
        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update exam
router.patch('/:id', auth, checkRole(['teacher', 'admin']), async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Check if user is the teacher or admin
        if (exam.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this exam' });
        }

        // Update fields
        Object.keys(req.body).forEach(update => {
            exam[update] = req.body[update];
        });

        await exam.save();
        res.json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete exam
router.delete('/:id', auth, checkRole(['teacher', 'admin']), async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Check if user is the teacher or admin
        if (exam.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this exam' });
        }

        await exam.remove();
        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start exam attempt
router.post('/:id/start', auth, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Check if already attempted
        const existingAttempt = exam.attempts.find(
            attempt => attempt.student.toString() === req.user._id.toString()
        );

        if (existingAttempt) {
            return res.status(400).json({ message: 'Already attempted this exam' });
        }

        const attempt = {
            student: req.user._id,
            startedAt: new Date()
        };

        exam.attempts.push(attempt);
        await exam.save();

        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Submit exam attempt
router.post('/:id/submit', auth, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const attempt = exam.attempts.find(
            attempt => attempt.student.toString() === req.user._id.toString()
        );

        if (!attempt) {
            return res.status(400).json({ message: 'No attempt found for this exam' });
        }

        if (attempt.completedAt) {
            return res.status(400).json({ message: 'Exam already submitted' });
        }

        // Calculate score
        let score = 0;
        const answers = req.body.answers;

        for (const answer of answers) {
            const question = exam.questions.id(answer.questionId);
            if (!question) continue;

            const isCorrect = answer.selectedOptions.every(
                (optionIndex, i) => question.options[optionIndex].isCorrect
            );

            if (isCorrect) {
                score += question.points;
            }

            attempt.answers.push({
                questionId: answer.questionId,
                selectedOptions: answer.selectedOptions,
                isCorrect
            });
        }

        attempt.score = score;
        attempt.completedAt = new Date();
        await exam.save();

        res.json({
            score,
            totalPoints: exam.calculateTotalPoints(),
            passed: score >= exam.passingScore
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 