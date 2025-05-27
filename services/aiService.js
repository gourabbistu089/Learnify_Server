const OpenAI = require('openai');
const axios = require('axios');

class AIService {
  constructor() {
    // Initialize OpenAI (you'll need to add your API key to .env)
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // Generate blog ideas based on course topics or keywords
  async generateBlogIdeas(topic, courseTitle = null, count = 5) {
    try {
      const prompt = `Generate ${count} engaging blog post ideas for ${courseTitle ? `a course about "${courseTitle}"` : `the topic "${topic}"`}. 
      The ideas should be:
      - Educational and valuable for students
      - Engaging and click-worthy
      - Relevant to online learning
      - Suitable for both beginners and intermediate learners
      
      Format as a JSON array with objects containing 'title' and 'description' fields.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.7
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating blog ideas:', error);
      throw new Error('Failed to generate blog ideas');
    }
  }

  // Generate full blog content from title and outline
  async generateBlogContent(title, outline = null, tone = 'informative') {
    try {
      const prompt = `Write a comprehensive blog post with the title: "${title}"
      ${outline ? `Following this outline: ${outline}` : ''}
      
      Requirements:
      - Tone: ${tone}
      - Length: 800-1200 words
      - Include proper HTML formatting (h2, h3, p, ul, li tags)
      - Add practical examples and actionable tips
      - Make it engaging for students and instructors
      - Include a conclusion with key takeaways
      
      Format the response as JSON with 'content', 'excerpt', and 'suggestedTags' fields.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.6
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating blog content:', error);
      throw new Error('Failed to generate blog content');
    }
  }

  // Improve existing content
  async improveContent(content, focusArea = 'general') {
    try {
      const prompt = `Improve the following blog content focusing on ${focusArea}:

      "${content}"

      Improvements needed:
      - Better readability and flow
      - More engaging language
      - Clear structure with proper headings
      - Add examples where appropriate
      - Ensure educational value
      
      Return the improved content maintaining HTML formatting.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.5
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error improving content:', error);
      throw new Error('Failed to improve content');
    }
  }

  // Generate SEO metadata
  async generateSEOData(title, content) {
    try {
      const prompt = `Based on this blog post title "${title}" and content preview:
      "${content.substring(0, 500)}..."
      
      Generate SEO optimization data as JSON with:
      - seoTitle (max 60 chars, engaging and keyword-rich)
      - metaDescription (max 160 chars, compelling description)
      - suggestedTags (array of 5-8 relevant tags)
      - focusKeywords (array of 3-5 main keywords)`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating SEO data:', error);
      throw new Error('Failed to generate SEO data');
    }
  }

  // Grammar and spell check
  async checkGrammar(text) {
    try {
      const prompt = `Please check and correct the grammar, spelling, and punctuation in the following text. 
      Return only the corrected text without explanations:
      
      "${text}"`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: Math.ceil(text.length * 1.2),
        temperature: 0.1
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error checking grammar:', error);
      throw new Error('Failed to check grammar');
    }
  }

  // Generate content outline
  async generateOutline(topic, targetAudience = 'students') {
    try {
      const prompt = `Create a detailed blog post outline for the topic: "${topic}"
      Target audience: ${targetAudience}
      
      Include:
      - Main sections with H2 headings
      - Sub-sections with H3 headings
      - Key points to cover in each section
      - Estimated word count for each section
      
      Format as JSON with structured outline.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.6
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating outline:', error);
      throw new Error('Failed to generate outline');
    }
  }

  // Fallback for when OpenAI is not available or API key is missing
  async generateFallbackContent(title) {
    const templates = {
      tutorial: {
        content: `<h2>Introduction</h2><p>Welcome to this comprehensive guide on ${title}.</p><h2>Getting Started</h2><p>Let's begin with the basics...</p><h2>Step-by-Step Process</h2><p>Follow these steps to master the concept...</p><h2>Best Practices</h2><p>Here are some proven strategies...</p><h2>Common Mistakes to Avoid</h2><p>Watch out for these pitfalls...</p><h2>Conclusion</h2><p>You've learned the fundamentals. Keep practicing!</p>`,
        excerpt: `A comprehensive guide covering the essentials of ${title} with practical examples and expert tips.`,
        suggestedTags: ['tutorial', 'guide', 'learning', 'education']
      },
      tips: {
        content: `<h2>Why This Matters</h2><p>${title} is crucial for your success in learning.</p><h2>Top Tips</h2><ul><li>Focus on understanding fundamentals</li><li>Practice regularly</li><li>Seek feedback from peers</li><li>Apply knowledge to real projects</li></ul><h2>Implementation Strategy</h2><p>Here's how to put these tips into practice...</p><h2>Measuring Progress</h2><p>Track your improvement with these methods...</p>`,
        excerpt: `Practical tips and strategies for ${title} that you can implement immediately.`,
        suggestedTags: ['tips', 'strategy', 'improvement', 'learning']
      }
    };

    const type = title.toLowerCase().includes('tip') ? 'tips' : 'tutorial';
    return templates[type];
  }
}

module.exports = new AIService();