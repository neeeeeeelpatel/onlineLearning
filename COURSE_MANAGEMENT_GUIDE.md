# Course Management Guide for Instructors

## How to Add Your Courses to the Website

This guide explains how instructors can create, manage, and publish courses that will appear on the website for students to discover and enroll in.

## 🚀 Quick Start

### 1. Login as Instructor
- Use the instructor credentials: `inst@nex.com` / `inst123`
- You'll be automatically redirected to the Instructor Dashboard

### 2. Create Your First Course
1. Click **"Create New Course"** button
2. Fill in the course details in the Course Builder
3. Add modules and lessons
4. Click **"Save Course"**

### 3. Publish Your Course
1. Go to **"My Courses"** in the navigation
2. Find your course in the list
3. Click **"Publish"** to make it visible to students

## 📋 Detailed Process

### Step 1: Access Course Builder
- Navigate to **"Course Builder"** from the top navigation
- Or click **"Create New Course"** from your instructor dashboard

### Step 2: Fill Basic Information
- **Course Title**: Choose a compelling, descriptive title
- **Description**: Write a detailed description of what students will learn
- **Category**: Select the most appropriate category
- **Level**: Choose Beginner, Intermediate, Advanced, or All Levels
- **Price**: Set your course price
- **Thumbnail**: Add a course image URL (optional)

### Step 3: Add Learning Outcomes
- List what students will learn from your course
- Add multiple outcomes to make your course more attractive

### Step 4: Set Requirements
- Specify any prerequisites or requirements
- Help students understand if the course is right for them

### Step 5: Define Target Audience
- Describe who this course is designed for
- Help with course discovery and enrollment

### Step 6: Build Curriculum
- **Add Modules**: Organize your content into logical sections
- **Add Lessons**: Create individual lessons within each module
- **Set Duration**: Specify how long each lesson takes
- **Choose Content Type**: Video, text, or other formats

### Step 7: Set Pricing
- Set your course price
- Add discount price if applicable
- Configure any special offers

### Step 8: Save and Publish
- Click **"Save Course"** to store your work
- Go to **"My Courses"** to manage your courses
- Click **"Publish"** to make it live on the website

## 🎯 Course Management Features

### Instructor Dashboard
- **Overview**: See total courses, published vs drafts, student count
- **Course List**: View all your courses with status indicators
- **Quick Actions**: Edit, publish, unpublish, or delete courses

### Course Status
- **Draft**: Course is saved but not visible to students
- **Published**: Course is live and visible in the course catalog
- **Archived**: Course is hidden from students (future feature)

### Course Analytics (Future)
- Student enrollment numbers
- Course completion rates
- Student ratings and reviews
- Revenue tracking

## 🔧 Technical Details

### Data Storage
- Courses are stored in the browser's localStorage
- This ensures your courses persist between sessions
- In a production environment, this would connect to a backend database

### Course Structure
```javascript
{
  id: "unique_course_id",
  title: "Course Title",
  description: "Course description",
  instructor: "instructor@email.com",
  category: "Web Development",
  level: "Beginner",
  price: 49.99,
  thumbnail: "image_url",
  modules: [
    {
      title: "Module Title",
      lessons: [
        {
          title: "Lesson Title",
          type: "video",
          duration: "00:15:00",
          content: "lesson_content"
        }
      ]
    }
  ],
  isPublished: false,
  status: "draft"
}
```

### File Structure
```
frontend/src/
├── pages/
│   ├── CourseBuilder.js          # Course creation interface
│   ├── InstructorDashboard.js    # Course management dashboard
│   └── CourseCatalog.js          # Public course listing
├── utils/
│   ├── courseService.js          # Course data management
│   └── mockData.js               # Initial sample data
└── components/
    └── CourseCard.js             # Course display component
```

## 🎨 Best Practices

### Course Creation
1. **Clear Title**: Make it descriptive and SEO-friendly
2. **Compelling Description**: Explain the value proposition
3. **Proper Categorization**: Help students find your course
4. **Realistic Pricing**: Research similar courses in your category
5. **Quality Thumbnail**: Use a professional, relevant image

### Content Organization
1. **Logical Structure**: Organize modules in a logical sequence
2. **Consistent Naming**: Use clear, descriptive lesson titles
3. **Appropriate Duration**: Set realistic time estimates
4. **Progressive Difficulty**: Start with basics, build to advanced

### Publishing Strategy
1. **Complete Content**: Ensure all modules and lessons are ready
2. **Test Your Course**: Review everything before publishing
3. **Monitor Performance**: Track enrollments and student feedback
4. **Regular Updates**: Keep content current and relevant

## 🚨 Troubleshooting

### Common Issues
- **Course not appearing**: Make sure it's published, not just saved
- **Changes not saving**: Check browser console for errors
- **Images not loading**: Verify thumbnail URLs are accessible
- **Navigation issues**: Ensure you're logged in as an instructor

### Data Persistence
- Courses are saved to localStorage automatically
- Clear browser data to reset to initial state
- Export/import functionality coming soon

## 🔮 Future Enhancements

### Planned Features
- **Course Templates**: Pre-built course structures
- **Rich Text Editor**: Enhanced content creation
- **File Upload**: Direct video and document uploads
- **Analytics Dashboard**: Detailed performance metrics
- **Student Management**: Track individual student progress
- **Revenue Reports**: Financial performance tracking
- **Course Reviews**: Student feedback system

### Backend Integration
- **Database Storage**: Persistent course data
- **User Authentication**: Secure instructor accounts
- **Payment Processing**: Integrated payment system
- **Content Delivery**: Video streaming and file hosting
- **Email Notifications**: Automated student communications

## 📞 Support

For technical issues or questions about course creation:
1. Check this guide first
2. Review the browser console for error messages
3. Ensure you're using the correct instructor credentials
4. Try refreshing the page and logging in again

---

**Happy Course Creating! 🎓**

Your courses will help students learn and grow. Take your time to create quality content that provides real value to your students. 