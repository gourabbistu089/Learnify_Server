const express = require('express');
const router = express.Router();
const blogController = require('../controllers/Blog');
const { auth,  } = require('../middlewares/auth'); 
// const { validateBlog, validateComment } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');
const {upload} = require("../middlewares/multer.middleware")

// Rate limiting for AI features
const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 AI requests per windowMs
  message: {
    success: false,
    message: 'Too many AI requests, please try again later.'
  }
});

// Rate limiting for general blog operations
const blogRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

// Apply rate limiting to all routes
router.use(blogRateLimit);

// Public routes
router.get('/', blogController.getAllBlogs);

// Protected routes (require authentication)
router.use(auth); // Apply authentication middleware to all routes below
router.get('/get-following-blogs', blogController.getFollowingBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);

// Blog CRUD operations
router.post('/create-blog',upload.single("image") , blogController.createBlog);
router.get('/my-blogs', blogController.getUserBlogs);
router.put('/:id', upload.single("image"), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

// Blog interactions
router.post('/:id/like', blogController.toggleLike);
router.post('/:id/comment', blogController.addComment);

// AI-powered features (with additional rate limiting)
// router.post('/ai/generate-ideas', aiRateLimit, blogController.generateBlogIdeas);
// router.post('/ai/generate-content', aiRateLimit, blogController.generateBlogContent);
// router.post('/ai/improve-content', aiRateLimit, blogController.improveContent);
// router.post('/ai/generate-seo', aiRateLimit, blogController.generateSEO);

module.exports = router;