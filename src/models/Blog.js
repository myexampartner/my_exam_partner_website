import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  description: {
    type: String,
    required: [true, 'Blog description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  image: {
    public_id: {
      type: String,
      default: 'placeholder'
    },
    url: {
      type: String,
      default: '/images/scholar.jpg'
    }
  },
  author: {
    type: String,
    required: true,
    default: 'Admin'
  },
  category: {
    type: String,
    required: true,
    enum: ['Education', 'Technology', 'Tips & Tricks', 'Career', 'Study Material', 'Exam Preparation', 'News', 'Other'],
    default: 'Education'
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  publishedAt: {
    type: Date
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Set publishedAt date when status changes to published
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Update lastModified on save
blogSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Create indexes for better performance (slug already has unique index, no need to add another)
blogSchema.index({ title: 'text', description: 'text', content: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;

