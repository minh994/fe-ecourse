const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/avatars/');
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

// Get all users (admin only)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort('-createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is requesting their own profile or is admin
        if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this profile' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.patch('/:id', auth, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is updating their own profile or is admin
        if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        // Update fields
        const updates = ['name', 'email'];
        updates.forEach(update => {
            if (req.body[update]) {
                user[update] = req.body[update];
            }
        });

        if (req.file) {
            user.avatar = `/uploads/avatars/${req.file.filename}`;
        }

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete user (admin only)
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Change password
router.post('/:id/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is changing their own password or is admin
        if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to change this password' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user's enrolled courses
router.get('/:id/courses', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate({
                path: 'enrolledCourses',
                select: 'title description thumbnail teacher',
                populate: {
                    path: 'teacher',
                    select: 'name email'
                }
            });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is requesting their own courses or is admin
        if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view these courses' });
        }

        res.json(user.enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 