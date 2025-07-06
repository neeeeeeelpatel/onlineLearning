import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const InstructorAnalytics = () => {
  const [loading] = useState(false);

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Sidebar /><div className="ml-64 p-8">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 pt-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <div className="flex gap-2">
              <select className="border rounded px-2 py-1">
                <option>All Courses</option>
                <option>React for Beginners</option>
                <option>Advanced CSS</option>
              </select>
              <input type="date" className="border rounded px-2 py-1" />
              <input type="date" className="border rounded px-2 py-1" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 min-h-[200px] flex items-center justify-center text-gray-400">[Enrollment Trends Chart]</div>
            <div className="bg-white rounded-xl shadow p-6 min-h-[200px] flex items-center justify-center text-gray-400">[Completion Rate Chart]</div>
            <div className="bg-white rounded-xl shadow p-6 min-h-[200px] flex items-center justify-center text-gray-400">[Quiz Performance Chart]</div>
            <div className="bg-white rounded-xl shadow p-6 min-h-[200px] flex items-center justify-center text-gray-400">[Revenue Chart]</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-4">Metric</th>
                  <th className="py-2 px-4">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-2 px-4">Total Enrollments</td><td className="py-2 px-4">120</td></tr>
                <tr><td className="py-2 px-4">Course Completions</td><td className="py-2 px-4">80</td></tr>
                <tr><td className="py-2 px-4">Average Quiz Score</td><td className="py-2 px-4">85%</td></tr>
                <tr><td className="py-2 px-4">Revenue</td><td className="py-2 px-4">$1,200</td></tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorAnalytics; 