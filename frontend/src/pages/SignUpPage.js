import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const SignUpPage = () => {
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
      console.log("Creating user with email:", email, "and role:", role);

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User created successfully:", user.uid);

      // Store user data in Firestore
      const userData = {
        email: email,
        role: role,
        createdAt: new Date().toISOString(),
        uid: user.uid
      };

      console.log("Storing user data in Firestore:", userData);

      await setDoc(doc(db, "users", user.uid), userData);

      console.log("User data stored successfully in Firestore");

      // Also store in localStorage for immediate access
      localStorage.setItem('user', JSON.stringify(userData));

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Sign up error:", err);
      setError(`Sign up failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="role">
            Role
          </label>
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
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        {success && <div className="mt-4 text-green-600 text-center">{success}</div>}
      </form>
    </div>
  );
};

export default SignUpPage;