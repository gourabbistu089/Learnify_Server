const Blog = require("../models/Blog");
// const aiService = require("../services/aiService.js");
const slugify = require("slugify");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const blogController = {
  // Get all blogs with filters and pagination
  async getAllBlogs(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        status = "published",
        author,
        tag,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      // Build filter object
      const filter = { status };

      if (category) filter.category = category;
      if (author) filter.author = author;
      if (tag) filter.tags = { $in: [tag] };
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      // Execute query with pagination
      const blogs = await Blog.find(filter)
        .populate("author", "firstName lastName email image")
        .populate("relatedCourses", "title thumbnail")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await Blog.countDocuments(filter);

      res.json({
        success: true,
        data: {
          blogs,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching blogs",
        error: error.message,
      });
    }
  },

  // Get single blog by slug
  async getBlogBySlug(req, res) {
    try {
      const { slug } = req.params;

      let blog = await Blog.findOne({ slug, status: "published" });

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      // Increment view count
      blog.views += 1;
      await blog.save();
      blog = await Blog.findOne({ slug, status: "published" })
        .populate("author", "firstName lastName email image")
        .populate("relatedCourses", "title thumbnail price")
        .populate("comments.user", "firstName lastName email image")
        .lean();
      res.json({
        success: true,
        data: blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching blog",
        error: error.message,
      });
    }
  },

  // Create new blog
  async createBlog(req, res) {
    try {
      const {
        title,
        content,
        excerpt,
        category,
        tags,
        status,
        relatedCourses,
      } = req.body;

      console.log(tags);
      console.log(typeof tags);
      // console.log("req.user.role",req.user)
      const authorType = req.user.authorType; // Assuming role is 'student' or 'instructor'

      const imgLocalPath = req.file?.path;
      if (!imgLocalPath) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }
      const imgUrl = await uploadOnCloudinary(imgLocalPath);
      const featuredImage = imgUrl.secure_url;
      const blog = new Blog({
        title,
        content,
        excerpt,
        author: req.user.id,
        authorType,
        category,
        tags: tags
          ? JSON.parse(tags).map((tag) => tag.toLowerCase().trim())
          : [],
        featuredImage,
        status: status || "draft",
        relatedCourses,
      });

      await blog.save();
      await blog.populate("author", "name email profilePicture");

      res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating blog",
        error: error.message,
      });
    }
  },

  // Update blog
  async updateBlog(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      // Check if user owns the blog
      if (blog.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this blog",
        });
      }

      // Handle tags
      if (updates.tags) {
        updates.tags = updates.tags.map((tag) => tag.toLowerCase().trim());
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate("author", "name email profilePicture");

      res.json({
        success: true,
        message: "Blog updated successfully",
        data: updatedBlog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating blog",
        error: error.message,
      });
    }
  },

  // Delete blog
  async deleteBlog(req, res) {
    try {
      const { id } = req.params;

      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      // Check if user owns the blog
      if (blog.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this blog",
        });
      }

      await Blog.findByIdAndDelete(id);

      res.json({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting blog",
        error: error.message,
      });
    }
  },

  // Get user's blogs
  async getUserBlogs(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const filter = { author: req.user.id };
      if (status) filter.status = status;

      const blogs = await Blog.find(filter)
        .populate("author", "firstName lastName email image")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Blog.countDocuments(filter);

      res.json({
        success: true,
        data: {
          blogs,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching user blogs",
        error: error.message,
      });
    }
  },

  // Like/Unlike blog
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      const existingLike = blog.likes.find(
        (like) => like.user.toString() === userId.toString()
      );

      if (existingLike) {
        // Remove like
        blog.likes = blog.likes.filter(
          (like) => like.user.toString() !== userId.toString()
        );
      } else {
        // Add like
        blog.likes.push({ user: userId });
      }

      await blog.save();

      res.json({
        success: true,
        message: existingLike ? "Blog like removed" : "Blog like added",
        data: {
          likeCount: blog.likes.length,
          isLiked: !existingLike,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error toggling like",
        error: error.message,
      });
    }
  },

  // Add comment
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Comment content is required",
        });
      }

      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      blog.comments.push({
        user: req.user.id,
        content: content.trim(),
      });

      await blog.save();
      await blog.populate("comments.user", "firstName lastName email image");

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: blog.comments[blog.comments.length - 1],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error adding comment",
        error: error.message,
      });
    }
  },

  // AI-powered features
  // async generateBlogIdeas(req, res) {
  //   try {
  //     const { topic, courseTitle, count = 5 } = req.body;

  //     if (!topic) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Topic is required",
  //       });
  //     }

  //     const ideas = await aiService.generateBlogIdeas(
  //       topic,
  //       courseTitle,
  //       count
  //     );

  //     res.json({
  //       success: true,
  //       data: ideas,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error generating blog ideas",
  //       error: error.message,
  //     });
  //   }
  // },

  // async generateBlogContent(req, res) {
  //   try {
  //     const { title, outline, tone = "informative" } = req.body;

  //     if (!title) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Title is required",
  //       });
  //     }

  //     let result;
  //     try {
  //       result = await aiService.generateBlogContent(title, outline, tone);
  //     } catch (aiError) {
  //       // Fallback to template-based generation
  //       result = await aiService.generateFallbackContent(title);
  //     }

  //     res.json({
  //       success: true,
  //       data: {
  //         title,
  //         ...result,
  //         aiGenerated: true,
  //         aiPrompt: `Generate blog content for: ${title}`,
  //       },
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error generating blog content",
  //       error: error.message,
  //     });
  //   }
  // },

  // async improveContent(req, res) {
  //   try {
  //     const { content, focusArea = "general" } = req.body;

  //     if (!content) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Content is required",
  //       });
  //     }

  //     const improvedContent = await aiService.improveContent(
  //       content,
  //       focusArea
  //     );

  //     res.json({
  //       success: true,
  //       data: {
  //         original: content,
  //         improved: improvedContent,
  //       },
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error improving content",
  //       error: error.message,
  //     });
  //   }
  // },

  // async generateSEO(req, res) {
  //   try {
  //     const { title, content } = req.body;

  //     if (!title || !content) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Title and content are required",
  //       });
  //     }

  //     const seoData = await aiService.generateSEOData(title, content);

  //     res.json({
  //       success: true,
  //       data: seoData,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error generating SEO data",
  //       error: error.message,
  //     });
  //   }
  // },
};

module.exports = blogController;
