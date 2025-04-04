const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/categories/');
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

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('parent', 'name')
            .sort('name');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parent', 'name')
            .populate('courses', 'title');
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create category
router.post('/', auth, checkRole(['admin']), upload.single('icon'), async (req, res) => {
    try {
        const category = new Category({
            ...req.body,
            icon: req.file ? `/uploads/categories/${req.file.filename}` : ''
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update category
router.patch('/:id', auth, checkRole(['admin']), upload.single('icon'), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update fields
        Object.keys(req.body).forEach(update => {
            category[update] = req.body[update];
        });

        if (req.file) {
            category.icon = `/uploads/categories/${req.file.filename}`;
        }

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete category
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if category has subcategories
        const hasSubcategories = await Category.exists({ parent: category._id });
        if (hasSubcategories) {
            return res.status(400).json({ 
                message: 'Cannot delete category with subcategories' 
            });
        }

        // Check if category has courses
        if (category.courses.length > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete category with courses' 
            });
        }

        await category.remove();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get subcategories
router.get('/:id/subcategories', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const subcategories = await category.getSubcategories();
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all courses in category and subcategories
router.get('/:id/courses', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const courses = await category.getAllCourses();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 