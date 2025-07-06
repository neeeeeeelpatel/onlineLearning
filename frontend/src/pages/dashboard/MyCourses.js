import React, { useEffect } from 'react';
import { db } from '../../firebase';
import { getUserData } from '../../utils/authUtils';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaUserCircle } from 'react-icons/fa';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];

const fallbackImg = 'https://via.placeholder.com/400x200?text=No+Image';

const getStatus = (progress) => {
  if (progress === 100) return { label: 'Completed', color: 'bg-green-100 text-green-700' };
  if (progress > 0) return { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700' };
  return { label: 'Not Started', color: 'bg-gray-100 text-gray-500' };
};

const MyCourses = () => {
  const user = getUserData();
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      try {
        const enrollQ = query(collection(db, 'enrollments'), where('userId', '==', user.uid));
        const enrollSnap = await getDocs(enrollQ);
        const enrollments = enrollSnap.docs.map(doc => doc.data());
        const courseIds = enrollments.map(e => e.courseId);
        if (courseIds.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }
        const courseQ = query(collection(db, 'courses'), where('id', 'in', courseIds));
        const courseSnap = await getDocs(courseQ);
        const courseList = courseSnap.docs.map(doc => {
          const course = { id: doc.id, ...doc.data() };
          const enrollment = enrollments.find(e => e.courseId === course.id);
          course.progress = enrollment ? enrollment.progress : 0;
          return course;
        });
        setCourses(courseList);
      } catch (err) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.uid) fetchEnrolledCourses();
  }, [user?.uid]);

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'in-progress') return course.progress > 0 && course.progress < 100;
    if (filter === 'completed') return course.progress === 100;
    return true;
  });

  if (loading) return <div className="p-8">Loading your courses...</div>;
  if (courses.length === 0) return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <div className="text-xl font-semibold mb-2">You are not enrolled in any courses yet.</div>
      <button onClick={() => window.location.href = '/courses'} className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded shadow font-bold hover:from-orange-600 hover:to-purple-700 transition">Browse Courses</button>
    </div>
  );
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6"><span className="text-orange-500">My</span> <span className="text-purple-600">Courses</span></h2>
      <div className="mb-6 flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full font-medium border transition shadow-sm ${filter === f.value ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white border-orange-400' : 'bg-white text-purple-600 border-purple-200 hover:bg-orange-50'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const status = getStatus(course.progress);
          return (
            <div key={course.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all p-4 flex flex-col group cursor-pointer border-l-4" style={{ borderImage: 'linear-gradient(to bottom, #FF6A00, #7F00FF) 1' }}>
              <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={course.thumbnail || fallbackImg}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                />
                <span className={`absolute top-2 left-2 px-3 py-1 text-xs rounded-full font-semibold shadow ${status.color}`}>{status.label}</span>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="font-semibold text-lg mb-1 truncate" title={course.title}>{course.title}</div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FaUserCircle className="mr-1 text-purple-600 text-lg" />
                  {course.instructor || 'Instructor'}
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-purple-600 h-3 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                    style={{ width: `${course.progress || 0}%` }}
                  >
                    <span className="absolute right-2 text-xs font-bold text-purple-900 drop-shadow" style={{ top: '-1.5rem' }}>{course.progress || 0}%</span>
                  </div>
                </div>
              </div>
              <button onClick={() => window.location.href = `/learn/${course.id}`} className="mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg font-bold shadow hover:from-orange-600 hover:to-purple-700 transition-all">Continue</button>
            </div>
          );
        })}
      </div>
      {filteredCourses.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No courses found for this filter.</div>
      )}
    </div>
  );
};

export default MyCourses; 