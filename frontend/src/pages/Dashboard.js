import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getUserData } from '../utils/authUtils';
import { auth, db } from '../firebase';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { FaRegSmile, FaCertificate } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { AiOutlineCheckCircle, AiOutlineNotification } from 'react-icons/ai';
import DashboardHome from './dashboard/DashboardHome';
import MyCourses from './dashboard/MyCourses';
import Quizzes from './dashboard/Quizzes';
import LearningPath from './dashboard/LearningPath';
import Settings from './dashboard/Settings';

const EditProfileModal = ({ open, onClose }) => {
  const user = getUserData();
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Update Firebase Auth
      if (auth.currentUser) {
        if (email !== user.email) {
          await updateEmail(auth.currentUser, email);
        }
        if (password) {
          await updatePassword(auth.currentUser, password);
        }
        await updateProfile(auth.currentUser, { displayName: name });
      }
      // Update Firestore
      if (user.uid) {
        await updateDoc(doc(db, 'users', user.uid), { email, name });
      }
      // Update localStorage
      const updatedUser = { ...user, email, name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
    return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">{success}</div>}
          <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-2 rounded font-semibold disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
        </div>
      </div>
    );
  };
  
const Dashboard = () => {
  // Edit Profile modal state (to be wired up)
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();

  // Redirect instructors away from learner dashboard
  useEffect(() => {
    const user = getUserData();
    if (user && user.role === 'instructor') {
      navigate('/instructor-dashboard', { replace: true });
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-purple-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar onEditProfile={() => setShowEditProfile(true)} />
        <main className="flex-1 bg-transparent min-h-screen pt-16 p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="learning-path" element={<LearningPath />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<DashboardHome />} />
          </Routes>
      </main>
      </div>
      <EditProfileModal open={showEditProfile} onClose={() => setShowEditProfile(false)} />
    </div>
  );
};

export default Dashboard;