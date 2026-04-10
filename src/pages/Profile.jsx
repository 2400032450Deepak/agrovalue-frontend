import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Name:</label>
            <p className="text-gray-700">{user?.name}</p>
          </div>
          <div>
            <label className="font-semibold">Email:</label>
            <p className="text-gray-700">{user?.email}</p>
          </div>
          <div>
            <label className="font-semibold">Role:</label>
            <p className="text-gray-700">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;