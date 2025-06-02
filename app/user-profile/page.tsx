"use client";

import HeaderBar from "@/components/partials/header";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [userData, setUserData] = useState(user?.profile);

  useEffect(() => {
    setUserData(user);
  }, [user]);
  const handleChangePassword = () => {
    alert("Redirecting to Change Password...");
    // Replace this with actual route or modal logic
  };

  return (
    <>
    
    <HeaderBar />
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            User ID
          </label>
          <input
            type="text"
            value={userData._id}
            disabled
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={userData.email}
            disabled
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={userData.first_name}
            disabled
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            value={userData.last_name}
            disabled
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Created At
          </label>
          <input
            type="text"
            value={new Date(userData.created_at).toLocaleString()}
            disabled
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Modified At
          </label>
          <input
            type="text"
            value={new Date(userData.modified_at).toLocaleString()}
            disabled
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleChangePassword}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default UserProfile;
