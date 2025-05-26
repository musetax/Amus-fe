"use client";

import { useEffect, useState } from "react";
import HeaderBar from "@/components/partials/header";
import { Assistant } from "./assistant";

export default function Home() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    localStorage.clear();
    const storedEmail = localStorage.getItem("chat_email");
    if (!storedEmail) {
      setShowModal(true);
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem("chat_email", email);
      setShowModal(false);
    }
  };

  return (
    <>
      <HeaderBar />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Enter your email</h2>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="you@example.com"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <Assistant />
    </>
  );
}
