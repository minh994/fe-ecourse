const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/courses/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('category', 'name')
            .populate('teacher', 'name email')
            .sort('-createdAt');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('category', 'name')
            .populate('teacher', 'name email')
            .populate('students', 'name email')
            .populate('reviews.student', 'name email');
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create course
router.post('/', auth, checkRole(['teacher', 'admin']), upload.single('thumbnail'), async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            teacher: req.user._id,
            thumbnail: req.file ? `/uploads/courses/${req.file.filename}` : ''
        });

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update course
router.patch('/:id', auth, checkRole(['teacher', 'admin']), upload.single('thumbnail'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the teacher or admin
        if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        // Update fields
        Object.keys(req.body).forEach(update => {
            course[update] = req.body[update];
        });

        if (req.file) {
            course.thumbnail = `/uploads/courses/${req.file.filename}`;
        }

        await course.save();
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete course
router.delete('/:id', auth, checkRole(['teacher', 'admin']), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the teacher or admin
        if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        await course.remove();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if already enrolled
        if (course.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        course.students.push(req.user._id);
        await course.save();

        res.json({ message: 'Enrolled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if already reviewed
        const alreadyReviewed = course.reviews.find(
            review => review.student.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Course already reviewed' });
        }

        const review = {
            student: req.user._id,
            rating: req.body.rating,
            comment: req.body.comment
        };

        course.reviews.push(review);
        course.calculateRating();
        await course.save();

        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 