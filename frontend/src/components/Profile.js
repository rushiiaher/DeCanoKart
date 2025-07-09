import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const Profile = ({ onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(name, email);
    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setError(result.error);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Profile;