"use client";

import HeaderBar from "@/components/partials/header";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
    const [loading,setLoading]=useState(false)
    const router= useRouter()
  const user = useSelector((state: RootState) => state.auth.user);

  const handleChangePassword = () => {
    setLoading(true)
    router.push("/change-user-password")
    setLoading(false)

  };
useEffect(()=>{
    setLoading(false)

},[])
  return (
    <>
      <HeaderBar />
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user?.profile.email}
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
              value={user?.profile.first_name}
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
              value={user?.profile.last_name}
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
                {loading ? 'loading...':'Change Password'}
              
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserProfile;
