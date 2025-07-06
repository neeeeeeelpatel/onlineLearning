import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const SignUpForm = ({ onSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [role, setRole] = useState("learner");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = {
        email: email,
        role: role,
        createdAt: new Date().toISOString(),
        uid: user.uid
      };
      await setDoc(doc(db, "users", user.uid), userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setSuccess("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(`Sign up failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="role">Role</label>
        <select
          id="role"
          className="w-full px-3 py-2 border border-gray-300 rounded"
          value={role}
          onChange={e => setRole(e.target.value)}
          required
        >
          <option value="learner">Learner</option>
          <option value="instructor">Instructor</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-500 text-white py-2 rounded hover:bg-primary-600 transition-colors font-semibold disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
      {error && <div className="mt-2 text-red-600 text-center">{error}</div>}
      {success && <div className="mt-2 text-green-600 text-center">{success}</div>}
      <div className="mt-4 text-center">
        <span className="text-gray-600">Already have an account? </span>
        <button type="button" className="text-primary-600 hover:underline font-medium" onClick={onSwitchToLogin}>Sign in</button>
      </div>
    </form>
  );
};

export default SignUpForm;