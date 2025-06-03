
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have User model for both students and instructors
    required: true
  },
  authorType: {
    type: String,
    enum: ['student', 'instructor'],
    // required: true
  },
  category: {
    type: String,
   enum: ['Technology', 'Programming', 'Web Development', 'Data Science', 'AI/ML', 'Business', 'Career', 'Other'],
    default: 'Technology'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featuredImage: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  // AI-powered fields
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: {
    type: String, // Store the original AI prompt used
  },
  seoTitle: {
    type: String,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  readingTime: {
    type: Number, // in minutes
    default: 0
  },
  // Engagement metrics
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Related courses (optional)
  relatedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course' // Assuming you have Course model
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
BlogSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
BlogSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Indexes for better performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ author: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug and calculate reading time
BlogSchema.pre('save', function(next) {
  const slugify = require('slugify');
  
  // Generate slug from title
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  
  // Calculate reading time (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  // Generate excerpt if not provided
  if (this.content && !this.excerpt) {
    const plainText = this.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    this.excerpt = plainText.substring(0, 297) + '...';
  }
  
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);