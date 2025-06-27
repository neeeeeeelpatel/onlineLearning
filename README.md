# Nxtra E-learning Platform

## Overview

Nxtra E-learning Platform is a modern web application for creating, managing, and delivering online courses. It enables instructors to build and publish courses, and allows students to browse, enroll, learn, take quizzes, and earn certificates—all in a seamless, interactive environment.

## ✨ Features

- **Instructor Dashboard**: Manage courses, view stats, and perform quick actions (edit, publish, delete).
- **Course Builder**: Create courses with modules, lessons, outcomes, requirements, and pricing.
- **Course Catalog**: Browse all published courses with search and filtering.
- **Course Player**: Interactive learning experience with video/text lessons and progress tracking.
- **Quiz Interface**: Take quizzes to assess learning.
- **Payment Integration**: Simulated payment flow for course enrollment.
- **Certificate Generation**: Earn and download certificates upon course completion.
- **Role-based Access**: Separate dashboards and permissions for instructors and students.
- **Local Data Persistence**: All data is stored in the browser's localStorage for demo purposes.

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **State/Data**: localStorage (no backend required)
- **Icons**: Heroicons, React Icons
- **Video**: React Player
- **Testing**: React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or above recommended)
- npm (v6 or above)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd Nxtra-E-learning-platform-main/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000).

## 🧭 Usage & Main Pages

| Route                         | Description                               |
| ----------------------------- | ----------------------------------------- |
| `/login`                      | Login page (student/instructor)           |
| `/dashboard`                  | Student dashboard                         |
| `/instructor-dashboard`       | Instructor dashboard                      |
| `/courses`                    | Course catalog                            |
| `/courses/:courseId`          | Course detail page                        |
| `/learn/:courseId`            | Course player (lessons)                   |
| `/quiz/:quizId`               | Quiz interface                            |
| `/payment/:courseId`          | Payment page                              |
| `/certificate/:certificateId` | Certificate page                          |
| `/course-builder`             | Create a new course (instructor only)     |
| `/course-builder/:courseId`   | Edit an existing course (instructor only) |

## 👩‍🏫 Instructor Workflow

1. **Login as Instructor**
   - Use credentials: `inst@nex.com` / `inst123`
2. **Create Course**
   - Go to "Course Builder" or click "Create New Course" in the dashboard
   - Fill in course details, modules, lessons, outcomes, requirements, and pricing
   - Save the course
3. **Publish Course**
   - Go to "My Courses" in the dashboard
   - Click "Publish" to make the course live
4. **Manage Courses**
   - Edit, publish/unpublish, or delete courses from the dashboard

## 🗂️ File Structure (Key Parts)

```
frontend/src/
├── pages/
│   ├── CourseBuilder.js          # Course creation interface
│   ├── InstructorDashboard.js    # Instructor dashboard
│   ├── CourseCatalog.js          # Public course listing
│   ├── ...                      # Other main pages
├── utils/
│   ├── courseService.js          # Course data management
│   └── mockData.js               # Sample data
├── components/
│   ├── CourseCard.js             # Course display card
│   ├── Navbar.js, Sidebar.js     # Layout components
└── routes/
    └── AppRoutes.js              # Main app routing
```

## 🐞 Troubleshooting

- **Course not appearing?** Ensure it is published, not just saved.
- **Changes not saving?** Check browser console for errors.
- **Images not loading?** Verify thumbnail URLs are correct.
- **Navigation issues?** Make sure you are logged in with the correct role.
- **Reset data?** Clear browser localStorage to reset demo data.

## 🔮 Future Enhancements

- Analytics dashboard for instructors
- Student management and progress tracking
- Rich text editor for lessons
- File uploads for videos and documents
- Backend integration for persistent data
- Payment gateway integration
- Course reviews and ratings

## 📞 Support

For technical issues or questions:

- Check the Course Management Guide (`COURSE_MANAGEMENT_GUIDE.md`)
- Review browser console for errors
- Use the provided instructor credentials for demo

---

**Happy Learning & Teaching!** 🎓
