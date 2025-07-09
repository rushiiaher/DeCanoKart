import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const ProfileEdit = () => {
  const { user, updateProfile, token } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    businessName: '',
    gstNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        businessName: user.businessName || '',
        gstNumber: user.gstNumber || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
      const updateData = {
        name: fullName,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        pincode: profileData.pincode,
        ...(user?.isSeller && {
          businessName: profileData.businessName,
          gstNumber: profileData.gstNumber
        })
      };

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update local user data
        const result = await updateProfile(fullName, profileData.email);
        if (!result.success) {
          console.error('Local update failed:', result.error);
        }
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 fade-in">
        <h2 className="text-5xl lg:text-6xl font-black mb-6 brand-name">Edit Profile</h2>
        <p className="text-xl text-base-content/70">Update your personal information</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl luxury-shadow">
          <div className="card-body p-8">
            {message.text && (
              <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">First Name</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="input input-bordered w-full"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Last Name</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="input input-bordered w-full"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="input input-bordered w-full"
                      value={profileData.email}
                      disabled
                      style={{ backgroundColor: 'var(--color-surface)', opacity: 0.7 }}
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">Email cannot be changed</span>
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="input input-bordered w-full"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="divider"></div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary mb-4">Address Information</h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">Address</span>
                  </label>
                  <textarea
                    name="address"
                    className="textarea textarea-bordered w-full"
                    rows="3"
                    value={profileData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">City</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      className="input input-bordered w-full"
                      value={profileData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">State</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      className="input input-bordered w-full"
                      value={profileData.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">PIN Code</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      className="input input-bordered w-full"
                      value={profileData.pincode}
                      onChange={handleInputChange}
                      placeholder="Enter PIN code"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information Section (for sellers) */}
              {user?.isSeller && (
                <>
                  <div className="divider"></div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-primary mb-4">Business Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content">Business Name</span>
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          className="input input-bordered w-full"
                          value={profileData.businessName}
                          onChange={handleInputChange}
                          placeholder="Enter business name"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base-content">GST Number</span>
                        </label>
                        <input
                          type="text"
                          name="gstNumber"
                          className="input input-bordered w-full"
                          value={profileData.gstNumber}
                          onChange={handleInputChange}
                          placeholder="Enter GST number"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="divider"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;