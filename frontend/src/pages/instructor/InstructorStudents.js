import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const mockStudents = [
  { id: 1, name: 'Alice Smith', email: 'alice@email.com', courses: ['React for Beginners'], progress: 80, quiz: 90, enrolled: '2024-06-01' },
  { id: 2, name: 'Bob Lee', email: 'bob@email.com', courses: ['Advanced CSS'], progress: 60, quiz: 75, enrolled: '2024-06-10' },
];

const InstructorStudents = () => {
  const [students] = useState(mockStudents);
  const [loading] = useState(false);

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Sidebar /><div className="ml-64 p-8">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 pt-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">Students</h1>
            <button className="px-4 py-2 bg-primary-600 text-white rounded font-semibold shadow hover:bg-primary-700">Export CSV</button>
          </div>
          {students.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">No students enrolled yet.</div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow p-6">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Courses Enrolled</th>
                    <th className="py-2 px-4">Progress (%)</th>
                    <th className="py-2 px-4">Quiz Score</th>
                    <th className="py-2 px-4">Enrolled Date</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id} className="border-t">
                      <td className="py-2 px-4 font-medium">{student.name}</td>
                      <td className="py-2 px-4">{student.email}</td>
                      <td className="py-2 px-4">{student.courses.join(', ')}</td>
                      <td className="py-2 px-4">{student.progress}%</td>
                      <td className="py-2 px-4">{student.quiz}</td>
                      <td className="py-2 px-4">{student.enrolled}</td>
                      <td className="py-2 px-4 space-x-2">
                        <button className="text-primary-600 hover:underline">View Profile</button>
                        <button className="text-blue-600 hover:underline">Message</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InstructorStudents; 