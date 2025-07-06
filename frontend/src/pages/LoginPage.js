import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateUser, saveUserData, isLoggedIn } from '../utils/authUtils';
import { demoUsers } from '../utils/mockData';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const LoginForm = ({ onSuccess, onSwitchToSignUp }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('learner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const localStorageData = {
          uid: user.uid,
          email: user.email,
          role: userData.role,
          createdAt: userData.createdAt
        };
        localStorage.setItem('user', JSON.stringify(localStorageData));
        if (userData.role === 'instructor') {
          navigate('/instructor-dashboard');
        } else if (userData.role === 'learner') {
          navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
        if (onSuccess) onSuccess();
      } else {
        setError('User data not found. Please try signing up again.');
      }
    } catch (err) {
      setError(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center mb-2">Sign In</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>
      {error && <div className="rounded bg-red-50 p-2 text-red-700 text-center">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <div className="mt-4 text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <button type="button" className="text-primary-600 hover:underline font-medium" onClick={onSwitchToSignUp}>Sign up</button>
      </div>
    </form>
  );
};

export default LoginForm;