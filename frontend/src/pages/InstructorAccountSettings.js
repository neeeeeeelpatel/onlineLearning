import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const TABS = [
  { label: 'Profile', value: 'profile' },
  { label: 'Change Password', value: 'password' },
  { label: 'Preferences', value: 'preferences' },
  { label: 'Account Actions', value: 'actions' },
];

const InstructorAccountSettings = () => {
  const [tab, setTab] = useState('profile');
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [prefMsg, setPrefMsg] = useState('');
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileMsg('Profile updated!');
    setTimeout(() => setProfileMsg(''), 2000);
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwMsg('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg('Password must be at least 6 characters.');
      return;
    }
    setPwMsg('Password changed!');
    setTimeout(() => setPwMsg(''), 2000);
  };
  const handlePrefSave = (e) => {
    e.preventDefault();
    setPrefMsg('Preferences saved!');
    setTimeout(() => setPrefMsg(''), 2000);
  };
  const handleDeactivate = () => {
    setActionMsg('Account deactivated (placeholder).');
    setShowDeactivate(false);
    setTimeout(() => setActionMsg(''), 2000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      <div className="mb-6 flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-full font-medium border transition shadow-sm ${tab === t.value ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-primary-700 border-primary-200 hover:bg-primary-50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        {tab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatar ? (
                  <img src={URL.createObjectURL(avatar)} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="w-20 h-20 text-gray-300" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute bottom-0 right-0 w-6 h-6 opacity-0 cursor-pointer"
                  onChange={e => setAvatar(e.target.files[0])}
                  title="Upload avatar"
                />
                <span className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1 text-xs cursor-pointer">✏️</span>
              </div>
              <div>
                <div className="font-semibold">Profile Picture</div>
                <div className="text-xs text-gray-500">Upload/change your avatar</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" className="w-full px-3 py-2 border rounded" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input type="email" className="w-full px-3 py-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded font-semibold">Save Changes</button>
            {profileMsg && <div className="text-green-600 text-center mt-2">{profileMsg}</div>}
          </form>
        )}
        {tab === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Old Password</label>
              <input type="password" className="w-full px-3 py-2 border rounded" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input type="password" className="w-full px-3 py-2 border rounded" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input type="password" className="w-full px-3 py-2 border rounded" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded font-semibold">Change Password</button>
            {pwMsg && <div className={`text-center mt-2 ${pwMsg.includes('changed') ? 'text-green-600' : 'text-red-600'}`}>{pwMsg}</div>}
          </form>
        )}
        {tab === 'preferences' && (
          <form onSubmit={handlePrefSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Notifications</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notifications.email} onChange={e => setNotifications(n => ({ ...n, email: e.target.checked }))} />
                  Email
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notifications.push} onChange={e => setNotifications(n => ({ ...n, push: e.target.checked }))} />
                  Push
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <select className="w-full px-3 py-2 border rounded" value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select className="w-full px-3 py-2 border rounded" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded font-semibold">Save Preferences</button>
            {prefMsg && <div className="text-green-600 text-center mt-2">{prefMsg}</div>}
          </form>
        )}
        {tab === 'actions' && (
          <div className="space-y-6">
            <button
              className="bg-red-600 text-white px-6 py-2 rounded font-semibold"
              onClick={() => setShowDeactivate(true)}
            >
              Deactivate Account
            </button>
            {showDeactivate && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative">
                  <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowDeactivate(false)}>&times;</button>
                  <h3 className="text-xl font-bold mb-4">Confirm Deactivation</h3>
                  <p className="mb-6">Are you sure you want to deactivate your account? This action cannot be undone.</p>
                  <button className="bg-red-600 text-white px-6 py-2 rounded font-semibold mr-4" onClick={handleDeactivate}>Yes, Deactivate</button>
                  <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold" onClick={() => setShowDeactivate(false)}>Cancel</button>
                </div>
              </div>
            )}
            <button
              className="bg-primary-600 text-white px-6 py-2 rounded font-semibold"
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            >
              Logout
            </button>
            {actionMsg && <div className="text-green-600 text-center mt-2">{actionMsg}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorAccountSettings; 