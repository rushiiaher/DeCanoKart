import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';

const AddressSelection = ({ checkoutData, updateCheckoutData, nextStep, prevStep }) => {
  const { user, token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    mobile: '',
    pincode: '',
    house: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    type: 'Home',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      // Try to get addresses from localStorage first
      const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
      setAddresses(savedAddresses);
      const defaultAddr = savedAddresses.find(addr => addr.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
      
      // Then try API if available
      const response = await fetch('http://localhost:5000/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        const defaultAddr = data.find(addr => addr.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // Use localStorage as fallback
    }
  };

  const handlePincodeChange = async (pincode) => {
    setNewAddress(prev => ({ ...prev, pincode }));
    if (pincode.length === 6) {
      // Mock API call for pincode lookup
      setNewAddress(prev => ({
        ...prev,
        city: 'Mumbai',
        state: 'Maharashtra'
      }));
    }
  };

  const saveAddress = async () => {
    try {
      const addressWithId = { ...newAddress, _id: Date.now().toString() };
      
      // Save to localStorage
      const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
      const updatedAddresses = [...savedAddresses, addressWithId];
      localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      
      setAddresses(updatedAddresses);
      setSelectedAddress(addressWithId);
      setShowAddForm(false);
      setNewAddress({
        fullName: '',
        mobile: '',
        pincode: '',
        house: '',
        area: '',
        landmark: '',
        city: '',
        state: '',
        type: 'Home',
        isDefault: false
      });
      
      // Try to save to API as well
      const response = await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAddress)
      });
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleContinue = () => {
    if (selectedAddress) {
      updateCheckoutData({ selectedAddress });
      nextStep();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Select Delivery Address</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              + Add New Address
            </button>
          </div>

          {/* Existing Addresses */}
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedAddress?._id === address._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{address.fullName}</span>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {address.house}, {address.area}
                      {address.landmark && `, ${address.landmark}`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-gray-600 text-sm">Mobile: {address.mobile}</p>
                  </div>
                  <input
                    type="radio"
                    checked={selectedAddress?._id === address._id}
                    onChange={() => setSelectedAddress(address)}
                    className="mt-1"
                  />
                </div>
                {selectedAddress?._id === address._id && (
                  <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600">
                    Deliver Here
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add New Address Form */}
          {showAddForm && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Add New Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name*"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number*"
                  value={newAddress.mobile}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, mobile: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Pincode*"
                  value={newAddress.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="House/Flat Number*"
                  value={newAddress.house}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, house: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Area/Street*"
                  value={newAddress.area}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, area: e.target.value }))}
                  className="px-3 py-2 border rounded-lg md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Landmark"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  readOnly
                  className="px-3 py-2 border rounded-lg bg-gray-50"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  readOnly
                  className="px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="mr-2"
                />
                <label className="text-sm">Make this my default address</label>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveAddress}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Address
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items ({checkoutData.items.length})</span>
              <span>₹{checkoutData.orderTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{checkoutData.orderTotal?.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedAddress}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;