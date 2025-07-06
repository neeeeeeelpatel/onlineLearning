import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Link } from 'react-router-dom';

const mockCourses = [
  { id: 1, title: 'React for Beginners', category: 'Web Dev', level: 'Beginner', status: 'Published', students: 40, rating: 4.5, thumbnail: '', },
  { id: 2, title: 'Advanced CSS', category: 'Design', level: 'Intermediate', status: 'Draft', students: 0, rating: 0, thumbnail: '', },
];

const InstructorMyCourses = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [loading] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Sidebar /><div className="ml-64 p-8">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 pt-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <Link to="/instructor/course-builder" className="px-4 py-2 bg-primary-600 text-white rounded font-semibold shadow hover:bg-primary-700">Create Course</Link>
          </div>
          {courses.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="text-lg mb-2">No courses yet.</div>
              <Link to="/instructor/course-builder" className="text-primary-600 hover:underline font-semibold">Create your first course</Link>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow p-6">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="py-2 px-4">Thumbnail</th>
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Level</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Students</th>
                    <th className="py-2 px-4">Rating</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id} className="border-t">
                      <td className="py-2 px-4">
                        <img src={course.thumbnail || 'https://via.placeholder.com/60x40?text=Course'} alt="thumb" className="h-10 w-16 object-cover rounded" />
                      </td>
                      <td className="py-2 px-4 font-medium">{course.title}</td>
                      <td className="py-2 px-4">{course.category}</td>
                      <td className="py-2 px-4">{course.level}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${course.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{course.status}</span>
                      </td>
                      <td className="py-2 px-4">{course.students}</td>
                      <td className="py-2 px-4">{course.rating > 0 ? course.rating : '-'}</td>
                      <td className="py-2 px-4 space-x-2">
                        <Link to={`/course/${course.id}`} className="text-primary-600 hover:underline">View</Link>
                        <Link to={`/instructor/course-builder/edit/${course.id}`} className="text-blue-600 hover:underline">Edit</Link>
                        <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:underline">Delete</button>
                        <button className="text-yellow-600 hover:underline">{course.status === 'Published' ? 'Unpublish' : 'Publish'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Placeholder */}
              <div className="mt-4 flex justify-end text-sm text-gray-500">Page 1 of 1</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InstructorMyCourses; 