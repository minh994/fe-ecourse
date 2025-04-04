const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ''
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Get all subcategories
categorySchema.methods.getSubcategories = async function() {
    const Category = mongoose.model('Category');
    return await Category.find({ parent: this._id });
};

// Get all courses in category and subcategories
categorySchema.methods.getAllCourses = async function() {
    const Category = mongoose.model('Category');
    const subcategories = await this.getSubcategories();
    let allCourses = [...this.courses];
    
    for (const subcategory of subcategories) {
        allCourses = [...allCourses, ...subcategory.courses];
    }
    
    return allCourses;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 